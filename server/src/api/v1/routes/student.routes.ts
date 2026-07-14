import { Router } from "express";
import * as studentController from "@/api/v1/controllers/student.controller.js";
import softAuth from "@/api/v1/middlewares/softAuth.middleware.js";

const studentRouter = Router();

studentRouter.get(
  "/subjects/:subjectId/topics/:topicId/quiz",
  softAuth,
  studentController.getTopicQuiz
);

export default studentRouter;
