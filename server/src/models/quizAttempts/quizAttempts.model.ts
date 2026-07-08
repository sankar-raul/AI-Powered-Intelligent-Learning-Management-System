import IQuizAttempts from "@/@types/interface/quizAttempts.interface.js";
import { model } from "mongoose";
import quizAttemptsSchema from "./quizAttempts.schema.js";

const QuizAttemptsModel = model<IQuizAttempts>(
  "quiz_attemps",
  quizAttemptsSchema,
);

export default QuizAttemptsModel;
