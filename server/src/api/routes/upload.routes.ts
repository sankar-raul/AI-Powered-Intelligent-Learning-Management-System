import { Router } from "express";
import upload from "../middlewares/multer.middleware.js";
import { uploadFile } from "../controllers/upload.controller.js";

const uploadRouter = Router();

uploadRouter.post("/", upload.single("file"), uploadFile);

export default uploadRouter;
