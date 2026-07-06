import { Router } from "express";
import {
  createMaterial,
  createQuiz,
  createSubject,
  deleteSubject,
  generateQuizDraft,
  generateRoadmapDraft,
  getRoadmap,
  listMaterials,
  listMySubjects,
  listQuizzes,
  updateSubject,
  upsertRoadmap,
} from "@/api/controllers/teacher.controller.js";
import { requireAuth, requireRole } from "@/api/middlewares/auth.middleware.js";
import { teacherLimiter } from "@/api/middlewares/rateLimit.middleware.js";
import ROLE from "@/constants/role.constant.js";

const teacherRouter = Router();

teacherRouter.use(teacherLimiter);
teacherRouter.use(requireAuth, requireRole(ROLE.TEACHER, ROLE.ADMIN));

teacherRouter.post("/subjects", createSubject);
teacherRouter.get("/subjects", listMySubjects);
teacherRouter.patch("/subjects/:subjectId", updateSubject);
teacherRouter.delete("/subjects/:subjectId", deleteSubject);

teacherRouter.put("/subjects/:subjectId/roadmap", upsertRoadmap);
teacherRouter.get("/subjects/:subjectId/roadmap", getRoadmap);

teacherRouter.post("/subjects/:subjectId/materials", createMaterial);
teacherRouter.get("/subjects/:subjectId/materials", listMaterials);

teacherRouter.post("/subjects/:subjectId/quizzes", createQuiz);
teacherRouter.get("/subjects/:subjectId/quizzes", listQuizzes);

teacherRouter.post("/ai/roadmap-draft", generateRoadmapDraft);
teacherRouter.post("/ai/quiz-draft", generateQuizDraft);

export default teacherRouter;
