import { Types } from "mongoose";

export const DOC_TYPE = ["pdf", "doc", "image", "docx", "txt"] as const;
export const DOC_ROLE = ["SYLLABUS", "NOTES"] as const;
export type DocumentType = (typeof DOC_TYPE)[number];
export type DocumentRoles = (typeof DOC_ROLE)[number];
interface IDocument {
  _id?: Types.ObjectId;
  type: DocumentType;
  doc_role: DocumentRoles;
  file_users_count: number; // 🤪 if same file uploaded by two different users then share the one file with both and increse the count
  url: String;
  text_data?: String; // 🥱 for text extraction from pdf and doc files
  uploadedAt: Date;
  size: number; // bits
  file_fingerprint: String; // for file uniqueness discovery / to stop duplication
}
export default IDocument;
