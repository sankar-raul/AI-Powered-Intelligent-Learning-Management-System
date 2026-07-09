import mongoose from "mongoose";

export const SUBJECT_DIFFICULTIES = [
  "basic",
  "intermidiate",
  "advanced",
  "pro",
] as const;
export type SubjectDifficulty = (typeof SUBJECT_DIFFICULTIES)[number];

interface ISubject {
  _id?: String;
  title: String;
  description: String;
  teacher_id: String;
  thumbnail?: String;
  difficulty?: SubjectDifficulty;
  createdAt?: Date;
}

export default ISubject;
