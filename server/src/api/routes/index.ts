import { Router } from "express";
import authRouter from "@/api/routes/auth.routes.js";
import studentRouter from "@/api/routes/student.routes.js";
import teacherRouter from "@/api/routes/teacher.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/student", studentRouter);
apiRouter.use("/teacher", teacherRouter);

export default apiRouter;
