import { Router } from "express";
import * as authController from "@/api/v1/controllers/auth.controller.js";
import softAuth from "@/api/v1/middlewares/softAuth.middleware.js";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.get("/me", softAuth, authController.me);

export default authRouter;
