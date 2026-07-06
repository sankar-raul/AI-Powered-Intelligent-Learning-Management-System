import IStudyNotes, { NOTES_TYPES } from "@/@types/interface/studynotes.interface.js";
import { Schema, Types } from "mongoose";

const StudyMaterialSchema = new Schema<IStudyNotes>(
  {
    subjectId: { type: Types.ObjectId, required: true, ref: "subject" },
    topicId: { type: Types.ObjectId, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    type: { type: String, enum: NOTES_TYPES, required: true },
    fileUrl: { type: String, required: true, trim: true },
    uploadedBy: { type: Types.ObjectId, required: true, ref: "users" },
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

StudyMaterialSchema.index({ subjectId: 1, topicId: 1 });

export default StudyMaterialSchema;
