import IQuiz from "@/@types/interface/quizzes.interface.js";
import { model } from "mongoose";
import quizeSchema from "./quiz.schema.js";

const QuizeModel = model<IQuiz>("quizzes", quizeSchema)

export default QuizeModel