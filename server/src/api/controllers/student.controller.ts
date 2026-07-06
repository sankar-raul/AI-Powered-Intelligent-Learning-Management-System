import { Request, Response } from "express";
import { Types } from "mongoose";
import SubjectModel from "@/models/subjects/subject.model.js";
import RoadmapModel from "@/models/roadmap/roadmap.model.js";
import EnrollmentModel from "@/models/enrollment/enrollment.model.js";
import StudyMaterialModel from "@/models/studyMaterial/studyMaterial.model.js";
import QuizModel from "@/models/quiz/quiz.model.js";
import QuizAttemptModel from "@/models/quizAttempt/quizAttempt.model.js";
import AiChatModel from "@/models/aiChat/aiChat.model.js";
import aiService from "@/services/ai.service.js";
import { flattenRoadmapTopics, getTopicState, recomputeEnrollmentProgress } from "@/services/progress.service.js";

const ensureObjectId = (value: string) => Types.ObjectId.isValid(value);
const pickParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";

export const listSubjects = async (_req: Request, res: Response) => {
  const subjects = await SubjectModel.find().sort({ createdAt: -1 });
  res.status(200).json(subjects);
};

export const enrollSubject = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const subject = await SubjectModel.findById(subjectId);
  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  let enrollment = await EnrollmentModel.findOne({ studentId: userId, subjectId });
  if (!enrollment) {
    const topics = await flattenRoadmapTopics(subjectId);

    enrollment = await EnrollmentModel.create({
      studentId: userId,
      subjectId,
      progress: 0,
      studiedTopicIds: [],
      completedTopicIds: [],
      unlockedTopicIds: topics[0]?.topicId ? [topics[0].topicId] : [],
      lastAccessed: new Date(),
    });
  }

  const result = await recomputeEnrollmentProgress(userId, subjectId);
  res.status(200).json(result.enrollment);
};

export const getRoadmap = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);

  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const enrollment = await EnrollmentModel.findOne({ studentId: userId, subjectId });
  if (!enrollment) {
    res.status(404).json({ message: "Enroll in this subject first" });
    return;
  }

  const roadmap = await RoadmapModel.findOne({ subject_id: subjectId });
  if (!roadmap) {
    res.status(404).json({ message: "Roadmap not found" });
    return;
  }

  const { enrollment: refreshed } = await recomputeEnrollmentProgress(userId, subjectId);
  const topics = await flattenRoadmapTopics(subjectId);

  res.status(200).json({
    roadmap,
    progress: refreshed.progress,
    topics: topics.map((topic) => ({ ...topic, ...getTopicState(topic.topicId, refreshed) })),
  });
};

export const getTopicDetail = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  const topicId = pickParam(req.params.topicId);

  if (!ensureObjectId(subjectId) || !ensureObjectId(topicId)) {
    res.status(400).json({ message: "Invalid subject/topic id" });
    return;
  }

  const enrollment = await EnrollmentModel.findOne({ studentId: userId, subjectId });
  if (!enrollment) {
    res.status(404).json({ message: "Enroll in this subject first" });
    return;
  }

  const topicState = getTopicState(topicId, enrollment);
  if (!topicState.isUnlocked) {
    res.status(403).json({ message: "Topic is locked" });
    return;
  }

  const [materials, quiz, latestAttempt, chatThread] = await Promise.all([
    StudyMaterialModel.find({ subjectId, topicId }).sort({ createdAt: -1 }),
    QuizModel.findOne({ subjectId, topicId }),
    QuizModel.findOne({ subjectId, topicId }).then((q) =>
      q ? QuizAttemptModel.findOne({ studentId: userId, quizId: q._id }).sort({ submittedAt: -1 }) : null,
    ),
    AiChatModel.findOne({ userId, subjectId, topicId }),
  ]);

  res.status(200).json({
    ...topicState,
    materials,
    quizStatus: latestAttempt
      ? { attempted: true, score: latestAttempt.score, passed: latestAttempt.passed }
      : { attempted: false },
    chatMessages: chatThread?.messages ?? [],
    hasQuiz: Boolean(quiz),
    quizId: quiz?._id ?? null,
  });
};

export const markTopicStudied = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  const topicId = pickParam(req.params.topicId);

  if (!ensureObjectId(subjectId) || !ensureObjectId(topicId)) {
    res.status(400).json({ message: "Invalid subject/topic id" });
    return;
  }

  const enrollment = await EnrollmentModel.findOne({ studentId: userId, subjectId });
  if (!enrollment) {
    res.status(404).json({ message: "Enroll in this subject first" });
    return;
  }

  if (!getTopicState(topicId, enrollment).isUnlocked) {
    res.status(403).json({ message: "Topic is locked" });
    return;
  }

  if (!enrollment.studiedTopicIds.some((id) => String(id) === topicId)) {
    enrollment.studiedTopicIds.push(new Types.ObjectId(topicId));
    enrollment.lastAccessed = new Date();
    await enrollment.save();
  }

  const result = await recomputeEnrollmentProgress(userId, subjectId);

  res.status(200).json({
    message: "Topic marked as studied",
    enrollment: result.enrollment,
  });
};

export const submitQuizAttempt = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const quizId = pickParam(req.params.quizId);
  const { answers } = req.body as { answers: string[] };

  if (!ensureObjectId(quizId)) {
    res.status(400).json({ message: "Invalid quiz id" });
    return;
  }

  if (!Array.isArray(answers)) {
    res.status(400).json({ message: "answers must be an array" });
    return;
  }

  const quiz = await QuizModel.findById(quizId);
  if (!quiz) {
    res.status(404).json({ message: "Quiz not found" });
    return;
  }

  const enrollment = await EnrollmentModel.findOne({ studentId: userId, subjectId: quiz.subjectId });
  if (!enrollment) {
    res.status(404).json({ message: "Enroll in this subject first" });
    return;
  }

  if (!getTopicState(String(quiz.topicId), enrollment).isUnlocked) {
    res.status(403).json({ message: "Topic is locked" });
    return;
  }

  const total = quiz.questions.length;
  const correct = quiz.questions.reduce((count, question, index) => {
    if ((answers[index] ?? "").trim() === question.answer) {
      return count + 1;
    }

    return count;
  }, 0);

  const score = total === 0 ? 0 : Math.round((correct / total) * 100);
  const passed = score >= (quiz.passThreshold ?? 60);

  const attempt = await QuizAttemptModel.create({
    studentId: userId,
    quizId,
    score,
    passed,
    answers,
    submittedAt: new Date(),
  });

  const result = await recomputeEnrollmentProgress(userId, String(quiz.subjectId));

  res.status(201).json({
    attempt,
    passThreshold: quiz.passThreshold,
    enrollment: result.enrollment,
  });
};

export const getProgress = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);

  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const { enrollment, topics } = await recomputeEnrollmentProgress(userId, subjectId);

  res.status(200).json({
    subjectId,
    progress: enrollment.progress,
    completedTopics: enrollment.completedTopicIds.length,
    totalTopics: topics.length,
    unlockedTopics: enrollment.unlockedTopicIds.length,
  });
};

export const askTopicAi = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  const topicId = pickParam(req.params.topicId);
  const { question } = req.body;

  if (!question || typeof question !== "string") {
    res.status(400).json({ message: "question is required" });
    return;
  }

  const aiAnswer = await aiService.answerTopicQuestion(question);

  const thread = await AiChatModel.findOneAndUpdate(
    { userId, subjectId, topicId },
    {
      $push: {
        messages: {
          $each: [
            { role: "user", content: question, timestamp: new Date() },
            { role: "system", content: aiAnswer.answer, timestamp: new Date() },
          ],
        },
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  res.status(200).json({ answer: aiAnswer.answer, source: aiAnswer.source, messages: thread.messages });
};
