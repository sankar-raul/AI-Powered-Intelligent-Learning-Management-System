import { uploadToS3 } from "@/services/s3.service.js";
import { Request, Response } from "express";

export async function uploadFile(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const result = await uploadToS3(req.file, "SYLLABUS");

    return res.json(result);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Upload failed",
    });
  }
}
