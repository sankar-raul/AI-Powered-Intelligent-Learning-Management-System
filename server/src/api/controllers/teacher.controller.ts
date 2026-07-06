import { Request, Response } from "express";
import { Types } from "mongoose";
import SubjectModel from "@/models/subjects/subject.model.js";
import RoadmapModel from "@/models/roadmap/roadmap.model.js";
import QuizModel from "@/models/quiz/quiz.model.js";
import StudyMaterialModel from "@/models/studyMaterial/studyMaterial.model.js";
import aiService from "@/services/ai.service.js";

const ensureObjectId = (value: string) => Types.ObjectId.isValid(value);
const pickParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
const pickBody = (value: unknown) => (Array.isArray(value) ? value[0] : value);

export const createSubject = async (req: Request, res: Response) => {
  try {
    const userId = String(req.user!.userId);
    const { title, description, difficulty, thumbnail } = req.body;

    if (!title || !description || !difficulty) {
      res.status(400).json({ message: "title, description and difficulty are required" });
      return;
    }

    const subject = await SubjectModel.create({
      title,
      description,
      difficulty,
      thumbnail,
      teacher_id: userId,
    });

    res.status(201).json(subject);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const listMySubjects = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjects = await SubjectModel.find({ teacher_id: userId }).sort({ createdAt: -1 });
  res.status(200).json(subjects);
};

export const updateSubject = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const updates = {
    ...(typeof pickBody(req.body.title) === "string" ? { title: pickBody(req.body.title) } : {}),
    ...(typeof pickBody(req.body.description) === "string" ? { description: pickBody(req.body.description) } : {}),
    ...(typeof pickBody(req.body.thumbnail) === "string" ? { thumbnail: pickBody(req.body.thumbnail) } : {}),
    ...(typeof pickBody(req.body.difficulty) === "string" ? { difficulty: pickBody(req.body.difficulty) } : {}),
  };

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ message: "No valid fields supplied for update" });
    return;
  }

  const subject = await SubjectModel.findOneAndUpdate(
    { _id: subjectId, teacher_id: userId },
    updates,
    { new: true },
  );

  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  res.status(200).json(subject);
};

export const deleteSubject = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const deleted = await SubjectModel.findOneAndDelete({ _id: subjectId, teacher_id: userId });

  if (!deleted) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  await Promise.all([
    RoadmapModel.deleteOne({ subject_id: subjectId }),
    StudyMaterialModel.deleteMany({ subjectId }),
    QuizModel.deleteMany({ subjectId }),
  ]);

  res.status(200).json({ message: "Subject deleted" });
};

export const upsertRoadmap = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  const { units } = req.body;

  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const subject = await SubjectModel.findOne({ _id: subjectId, teacher_id: userId });
  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  if (!Array.isArray(units)) {
    res.status(400).json({ message: "units must be an array" });
    return;
  }

  const safeUnits = units.map((unit: any, unitIndex: number) => ({
    title: String(pickBody(unit?.title) ?? ""),
    order: Number.isFinite(Number(pickBody(unit?.order))) ? Number(pickBody(unit?.order)) : unitIndex + 1,
    topics: Array.isArray(unit?.topics)
      ? unit.topics.map((topic: any, topicIndex: number) => ({
          title: String(pickBody(topic?.title) ?? ""),
          description: String(pickBody(topic?.description) ?? ""),
          order:
            Number.isFinite(Number(pickBody(topic?.order))) ? Number(pickBody(topic?.order)) : topicIndex + 1,
        }))
      : [],
  }));

  const roadmap = await RoadmapModel.findOneAndUpdate(
    { subject_id: subjectId },
    { units: safeUnits, last_edited: new Date() },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  res.status(200).json(roadmap);
};

export const getRoadmap = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);

  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const subject = await SubjectModel.findOne({ _id: subjectId, teacher_id: userId });
  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const roadmap = await RoadmapModel.findOne({ subject_id: subjectId });
  res.status(200).json(roadmap);
};

export const createMaterial = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  const { topicId, title, description, type, fileUrl } = req.body;
  const safeTopicId = pickParam(topicId);

  if (!ensureObjectId(subjectId) || !ensureObjectId(safeTopicId)) {
    res.status(400).json({ message: "Invalid subject/topic id" });
    return;
  }

  if (!title || !type || !fileUrl) {
    res.status(400).json({ message: "title, type and fileUrl are required" });
    return;
  }

  const subject = await SubjectModel.findOne({ _id: subjectId, teacher_id: userId });
  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const material = await StudyMaterialModel.create({
    subjectId,
    topicId: safeTopicId,
    title,
    description,
    type,
    fileUrl,
    uploadedBy: userId,
    uploadedAt: new Date(),
  });

  res.status(201).json(material);
};

export const listMaterials = async (req: Request, res: Response) => {
  const subjectId = pickParam(req.params.subjectId);
  const { topicId } = req.query;

  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const filter: Record<string, unknown> = { subjectId };
  if (typeof topicId === "string" && ensureObjectId(topicId)) {
    filter.topicId = topicId;
  }

  const materials = await StudyMaterialModel.find(filter).sort({ createdAt: -1 });
  res.status(200).json(materials);
};

export const createQuiz = async (req: Request, res: Response) => {
  const userId = String(req.user!.userId);
  const subjectId = pickParam(req.params.subjectId);
  const { topicId, title, passThreshold, questions } = req.body;
  const safeTopicId = pickParam(topicId);

  if (!ensureObjectId(subjectId) || !ensureObjectId(safeTopicId)) {
    res.status(400).json({ message: "Invalid subject/topic id" });
    return;
  }

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    res.status(400).json({ message: "title and questions are required" });
    return;
  }

  const subject = await SubjectModel.findOne({ _id: subjectId, teacher_id: userId });
  if (!subject) {
    res.status(404).json({ message: "Subject not found" });
    return;
  }

  const quiz = await QuizModel.create({
    subjectId,
    topicId: safeTopicId,
    title,
    passThreshold: passThreshold ?? 60,
    questions,
  });

  res.status(201).json(quiz);
};

export const listQuizzes = async (req: Request, res: Response) => {
  const subjectId = pickParam(req.params.subjectId);
  const { topicId } = req.query;

  if (!ensureObjectId(subjectId)) {
    res.status(400).json({ message: "Invalid subject id" });
    return;
  }

  const filter: Record<string, unknown> = { subjectId };
  if (typeof topicId === "string" && ensureObjectId(topicId)) {
    filter.topicId = topicId;
  }

  const quizzes = await QuizModel.find(filter).sort({ createdAt: -1 });
  res.status(200).json(quizzes);
};

export const generateRoadmapDraft = async (_req: Request, res: Response) => {
  try {
    const draft = await aiService.generateRoadmapDraft();
    res.status(200).json(draft);
  } catch (error) {
    res.status(503).json({ message: (error as Error).message });
  }
};

export const generateQuizDraft = async (_req: Request, res: Response) => {
  try {
    const draft = await aiService.generateQuizDraft();
    res.status(200).json(draft);
  } catch (error) {
    res.status(503).json({ message: (error as Error).message });
  }
};
