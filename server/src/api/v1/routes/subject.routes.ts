import { Router } from "express";
import * as subjectController from "@/api/v1/controllers/subject.controller.js";
import upload from "../middlewares/multer.middleware.js";
const subjectRouter = Router();

subjectRouter.post(
  "/create",
  upload.fields([
    { name: "syllabus", maxCount: 1 },
    { name: "notes", maxCount: 100 },
  ]),
  subjectController.createSubject,
);

export default subjectRouter;
