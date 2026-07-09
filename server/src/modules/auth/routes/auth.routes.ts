import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { validateRequest } from "@/middlewares/validateRequest.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshSchema,
  registerSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";

const authRouter = Router();

authRouter.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);
authRouter.post("/login", validateRequest(loginSchema), authController.login);
authRouter.post(
  "/refresh",
  validateRequest(refreshSchema),
  authController.refresh,
);
authRouter.post("/logout", authController.logout);
authRouter.post("/logout-all", authenticate(), authController.logoutAll);
authRouter.get("/me", authenticate(), authController.me);
authRouter.patch(
  "/change-password",
  authenticate(),
  validateRequest(changePasswordSchema),
  authController.changePassword,
);
authRouter.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword,
);
authRouter.post(
  "/reset-password",
  validateRequest(resetPasswordSchema),
  authController.resetPassword,
);

export default authRouter;
