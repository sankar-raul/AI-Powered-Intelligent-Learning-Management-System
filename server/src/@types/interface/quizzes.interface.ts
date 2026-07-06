import { Types } from "mongoose";

interface IQuizQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation?: string;
}

interface IQuiz {
  _id?: Types.ObjectId;
  subjectId: Types.ObjectId;
  topicId: Types.ObjectId;
  title: string;
  passThreshold: number;
  questions: IQuizQuestion[];
}

export type { IQuizQuestion };
export default IQuiz;
