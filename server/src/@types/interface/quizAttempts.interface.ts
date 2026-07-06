import { Types } from "mongoose";

interface IQuizAttempts {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  quizId: Types.ObjectId;
  score: number;
  passed: boolean;
  answers: string[];
  submittedAt: Date;
}

export default IQuizAttempts;
