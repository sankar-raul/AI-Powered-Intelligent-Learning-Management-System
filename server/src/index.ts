import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import appConfig from "@/config/config.js";
import { connectDB } from "@/config/dbConnector.js";
import apiRouter from "@/api/routes/index.js";
import softAuth from "@/api/middlewares/softAuth.middleware.js";
import createRateLimiter from "@/api/middlewares/rateLimit.middleware.js";

const app = express();

(async () => {
  await connectDB();
})();

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(createRateLimiter({ windowMs: 60_000, limit: 120 }));
app.use(softAuth);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true, service: "AI LMS API" });
});

app.use("/api", apiRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: error.message || "Internal server error" });
});

app.listen(appConfig.PORT, () => {
  console.log(`http://127.0.0.1:${appConfig.PORT}`);
});
