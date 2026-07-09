import ISubject from "@/@types/interface/subject.interface.js";
import subjectQueue from "@/queues/subject.queue.js";
import SubjectService from "@/services/subject.service.js";
import { Request, Response } from "express";
export const createSubject = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.userId || "51b54eb4aa332679b971851e";
    const files = req.files as {
      syllabus?: Express.Multer.File[];
      notes?: Express.Multer.File[];
    };
    const syllabusFile = files?.syllabus?.[0];
    const notesFiles = files?.notes || [];
    const { title, description, thumbnail, difficulty } =
      req.body as Partial<ISubject>;
    if (!title || !description || !difficulty || !syllabusFile) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    const subject: ISubject = {
      title,
      description,
      teacher_id: user_id,
      thumbnail,
      difficulty,
    };
    const newSubject = await SubjectService.createSubject(
      subject,
      {
        syllabus: syllabusFile,
        notes: notesFiles,
      },
      user_id,
    );
    await subjectQueue.add("generate-roadmap", {
      subject_id: newSubject._id?.toString() as string,
      // subject_id: "6a4ff9aead2568a6b0025d31", // Replace with the actual subject ID
    });
    return res.status(201).json({
      message: "Subject created successfully",
      subject: newSubject,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Internal server error",
    });
  }
};
