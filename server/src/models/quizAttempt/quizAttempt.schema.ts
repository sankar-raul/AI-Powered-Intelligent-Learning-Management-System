import IQuizAttempts from "@/@types/interface/quizAttempts.interface.js";
import { Schema, Types } from "mongoose";

const QuizAttemptSchema = new Schema<IQuizAttempts>(
  {
    studentId: { type: Types.ObjectId, required: true, ref: "users" },
    quizId: { type: Types.ObjectId, required: true, ref: "quizzes" },
    score: { type: Number, required: true, min: 0, max: 100 },
    passed: { type: Boolean, required: true },
    answers: { type: [String], default: [] },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

QuizAttemptSchema.index({ quizId: 1, studentId: 1 });
QuizAttemptSchema.index({ studentId: 1, quizId: 1, submittedAt: -1 });

export default QuizAttemptSchema;
