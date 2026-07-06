import { Types } from "mongoose";

export const SUBJECT_DIFFICULTIES = ["basic", "intermidiate", "advanced", "pro"] as const;
export type SubjectDifficulty = (typeof SUBJECT_DIFFICULTIES)[number];

interface ISubject {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  teacher_id: Types.ObjectId;
  thumbnail?: string;
  difficulty: SubjectDifficulty;
  createdAt?: Date;
  updatedAt?: Date;
}

export default ISubject;
