import { Router } from "express";
import { login, me, register } from "@/api/controllers/auth.controller.js";
import { requireAuth } from "@/api/middlewares/auth.middleware.js";
import { authLimiter } from "@/api/middlewares/rateLimit.middleware.js";

const authRouter = Router();
authRouter.use(authLimiter);

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);

export default authRouter;
