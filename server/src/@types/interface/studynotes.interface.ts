import { Types } from "mongoose";

export const NOTES_TYPES = ["pdf", "doc", "image"] as const;
export type TNotesType = (typeof NOTES_TYPES)[number];

interface IStudyNotes {
  _id?: Types.ObjectId;
  subjectId: Types.ObjectId;
  topicId: Types.ObjectId;
  title: string;
  description?: string;
  type: TNotesType;
  fileUrl: string;
  uploadedBy: Types.ObjectId;
  uploadedAt: Date;
}

export default IStudyNotes;
