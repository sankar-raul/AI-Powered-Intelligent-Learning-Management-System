import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import appConfig from "@/config/config.js";
import { connectDB } from "./config/dbConnector.js";
import uploadRouter from "./api/v1/routes/upload.routes.js";
import subjectRouter from "./api/v1/routes/subject.routes.js";
import authRouter from "./api/v1/routes/auth.routes.js";
import studentRouter from "./api/v1/routes/student.routes.js";
const app = express();

(async () => {
  await connectDB();
})();
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any origin during development to handle localhost port switching (5173/5174/etc.)
      callback(null, true);
    },
    credentials: true,
  })
);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ ok: "jo" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/subject", subjectRouter);
app.use("/api/v1/upload", uploadRouter);
app.use("/api/v1/student", studentRouter);

app.listen(appConfig.PORT, () => {
  console.log(`http://127.0.0.1:${appConfig.PORT}`);
});
