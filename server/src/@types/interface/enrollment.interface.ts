import { Types } from "mongoose";

interface IEnrollment {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  subjectId: Types.ObjectId;
  progress: number; // in percentage / precalculated
  lastAccessed: Date;
}

export default IEnrollment;
