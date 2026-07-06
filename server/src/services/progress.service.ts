import { Types } from "mongoose";
import EnrollmentModel from "@/models/enrollment/enrollment.model.js";
import QuizAttemptModel from "@/models/quizAttempt/quizAttempt.model.js";
import QuizModel from "@/models/quiz/quiz.model.js";
import RoadmapModel from "@/models/roadmap/roadmap.model.js";

export interface FlatTopic {
  topicId: string;
  unitTitle: string;
  title: string;
  description: string;
  order: number;
}

const toIdSet = (ids: Types.ObjectId[] | string[]) => new Set(ids.map((id) => String(id)));

export const flattenRoadmapTopics = async (subjectId: string): Promise<FlatTopic[]> => {
  const roadmap = await RoadmapModel.findOne({ subject_id: subjectId }).lean();
  if (!roadmap) {
    return [];
  }

  return roadmap.units
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .flatMap((unit) =>
      (unit.topics ?? [])
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((topic) => ({
          topicId: String(topic._id),
          unitTitle: unit.title,
          title: topic.title,
          description: topic.description,
          order: topic.order,
        })),
    );
};

export const recomputeEnrollmentProgress = async (studentId: string, subjectId: string) => {
  const enrollment = await EnrollmentModel.findOne({ studentId, subjectId });
  if (!enrollment) {
    throw new Error("Enrollment not found");
  }

  const topics = await flattenRoadmapTopics(subjectId);
  const topicIds = topics.map((topic) => topic.topicId);

  const studied = toIdSet(enrollment.studiedTopicIds);

  const quizzes = await QuizModel.find({ subjectId, topicId: { $in: topicIds } }).lean();
  const quizByTopic = new Map(quizzes.map((quiz) => [String(quiz.topicId), quiz]));

  const attempts = await QuizAttemptModel.find({
    studentId,
    quizId: { $in: quizzes.map((quiz) => quiz._id) },
    passed: true,
  }).lean();

  const passedQuizIds = new Set(attempts.map((attempt) => String(attempt.quizId)));

  const completedTopicIds = topicIds.filter((topicId) => {
    if (!studied.has(topicId)) {
      return false;
    }

    const quiz = quizByTopic.get(topicId);
    if (!quiz) {
      return false;
    }

    return passedQuizIds.has(String(quiz._id));
  });

  const unlockedTopicIds: string[] = [];
  for (let i = 0; i < topicIds.length; i += 1) {
    if (i === 0 || completedTopicIds.includes(topicIds[i - 1])) {
      unlockedTopicIds.push(topicIds[i]);
    } else {
      break;
    }
  }

  const progress = topicIds.length === 0 ? 0 : Math.round((completedTopicIds.length / topicIds.length) * 100);

  enrollment.completedTopicIds = completedTopicIds.map((id) => new Types.ObjectId(id));
  enrollment.unlockedTopicIds = unlockedTopicIds.map((id) => new Types.ObjectId(id));
  enrollment.progress = progress;
  enrollment.lastAccessed = new Date();

  await enrollment.save();

  return {
    enrollment,
    topics,
  };
};

export const getTopicState = (topicId: string, enrollment: { studiedTopicIds: Types.ObjectId[]; completedTopicIds: Types.ObjectId[]; unlockedTopicIds: Types.ObjectId[]; }) => {
  const studiedSet = toIdSet(enrollment.studiedTopicIds);
  const completedSet = toIdSet(enrollment.completedTopicIds);
  const unlockedSet = toIdSet(enrollment.unlockedTopicIds);

  return {
    topicId,
    isStudied: studiedSet.has(topicId),
    isCompleted: completedSet.has(topicId),
    isUnlocked: unlockedSet.has(topicId),
  };
};
