import { Router } from "express";
import {
  askTopicAi,
  enrollSubject,
  getProgress,
  getRoadmap,
  getTopicDetail,
  listSubjects,
  markTopicStudied,
  submitQuizAttempt,
} from "@/api/controllers/student.controller.js";
import { requireAuth, requireRole } from "@/api/middlewares/auth.middleware.js";
import ROLE from "@/constants/role.constant.js";

const studentRouter = Router();

studentRouter.use(requireAuth, requireRole(ROLE.STUDENT, ROLE.ADMIN));

studentRouter.get("/subjects", listSubjects);
studentRouter.post("/subjects/:subjectId/enroll", enrollSubject);
studentRouter.get("/subjects/:subjectId/roadmap", getRoadmap);

studentRouter.get("/subjects/:subjectId/topics/:topicId", getTopicDetail);
studentRouter.post("/subjects/:subjectId/topics/:topicId/study", markTopicStudied);
studentRouter.post("/subjects/:subjectId/topics/:topicId/ask-ai", askTopicAi);

studentRouter.post("/quizzes/:quizId/attempt", submitQuizAttempt);
studentRouter.get("/enrollments/:subjectId/progress", getProgress);

export default studentRouter;
