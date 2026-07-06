import IEnrollment from "@/@types/interface/enrollment.interface.js";
import { Schema, Types } from "mongoose";

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: {
      type: Types.ObjectId,
      required: true,
      ref: "users",
    },
    subjectId: {
      type: Types.ObjectId,
      required: true,
      ref: "subject",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    studiedTopicIds: {
      type: [Types.ObjectId],
      default: [],
      ref: "roadmaps.units.topics",
    },
    completedTopicIds: {
      type: [Types.ObjectId],
      default: [],
      ref: "roadmaps.units.topics",
    },
    unlockedTopicIds: {
      type: [Types.ObjectId],
      default: [],
      ref: "roadmaps.units.topics",
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

EnrollmentSchema.index({ studentId: 1, subjectId: 1 }, { unique: true });
EnrollmentSchema.index({ studentId: 1 });
EnrollmentSchema.index({ subjectId: 1 });

export default EnrollmentSchema;
