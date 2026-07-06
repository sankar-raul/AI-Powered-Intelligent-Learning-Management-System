import ISubject, { SUBJECT_DIFFICULTIES } from "@/@types/interface/subject.interface.js";
import { Schema, Types } from "mongoose";

const SubjectSchema = new Schema<ISubject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    teacher_id: {
      type: Types.ObjectId,
      required: true,
      ref: "users",
    },
    thumbnail: {
      type: String,
      default: null,
    },
    difficulty: {
      type: String,
      enum: SUBJECT_DIFFICULTIES,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

SubjectSchema.index({ teacher_id: 1, createdAt: -1 });

export default SubjectSchema;
