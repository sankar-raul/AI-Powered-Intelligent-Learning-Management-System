import IQuiz from "@/@types/interface/quizzes.interface.js";
import { model } from "mongoose";
import QuizSchema from "./quiz.schema.js";

const QuizModel = model<IQuiz>("quizzes", QuizSchema);

export default QuizModel;
