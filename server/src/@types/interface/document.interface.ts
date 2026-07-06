import { Types } from "mongoose";

export const DOC_TYPE = ["pdf", "doc", "image"] as const;
export type TDocumentType = (typeof DOC_TYPE)[number];

interface IDocument {
  _id?: Types.ObjectId;
  type: TDocumentType;
  file_users_count: number;
  url: string;
  uploadedAt: Date;
  file_fingerprint: string;
}

export default IDocument;
