import { connectDB } from "@/config/dbConnector.js";
import "@/workers/subject.worker.js";

connectDB();
console.log("Workers started...");
