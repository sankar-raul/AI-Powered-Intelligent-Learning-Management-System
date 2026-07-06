import { Types } from "mongoose";

interface IEnrollment {
  _id?: Types.ObjectId;
  studentId: Types.ObjectId;
  subjectId: Types.ObjectId;
  progress: number;
  studiedTopicIds: Types.ObjectId[];
  completedTopicIds: Types.ObjectId[];
  unlockedTopicIds: Types.ObjectId[];
  lastAccessed: Date;
}

export default IEnrollment;
