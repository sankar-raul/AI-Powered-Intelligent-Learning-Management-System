import IQuizAttempts from "@/@types/interface/quizAttempts.interface.js";
import { model } from "mongoose";
import QuizAttemptSchema from "./quizAttempt.schema.js";

const QuizAttemptModel = model<IQuizAttempts>("quizAttempts", QuizAttemptSchema);

export default QuizAttemptModel;
