import { Types } from "mongoose";
import IDocument from "./document.interface.js";

export const NOTES_TYPES = ["pdf", "doc", "image"] as const;
export type TNotesType = (typeof NOTES_TYPES)[number];
interface IStudynotes {
  _id?: Types.ObjectId;
  subjectId: String;
  title: String;
  file_id: String;
  uploadedBy: String;
  uploadedAt: Date;
  file_info?: IDocument; // virtual populate
}
export default IStudynotes;
