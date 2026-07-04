import mongoose from "mongoose";
import appConfig from "./config.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(appConfig.MONGO_URI!);
    console.log("[MongoDB] MongoDB Connected successfully ✅");
  } catch (error) {
    console.error("[MongoDB] DB connection failed:", error);
  }
};