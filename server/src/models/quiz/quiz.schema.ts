import IQuiz from "@/@types/interface/quizzes.interface.js";
import { Schema, Types } from "mongoose";

const QuizQuestionSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    options: { type: [String], default: [], required: true },
    answer: { type: String, required: true, trim: true },
    explanation: { type: String, default: "", trim: true },
  },
  { _id: false },
);

const QuizSchema = new Schema<IQuiz>(
  {
    subjectId: { type: Types.ObjectId, required: true, ref: "subject" },
    topicId: { type: Types.ObjectId, required: true },
    title: { type: String, required: true, trim: true },
    passThreshold: { type: Number, default: 60, min: 0, max: 100 },
    questions: { type: [QuizQuestionSchema], default: [] },
  },
  { timestamps: true },
);

QuizSchema.index({ subjectId: 1, topicId: 1 });

export default QuizSchema;
