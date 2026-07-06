import { Types } from "mongoose"

export const DOC_TYPE = ['pdf', 'doc', 'image'] as const
export type TDocumentType = (typeof DOC_TYPE)[number]
interface IDocument {
    _id?: Types.ObjectId,
    type: TDocumentType,
    file_users_count: number, // 🤪 if same file uploaded by two different users then share the one file with both and increse the count
    url: String,
    uploadedAt: Date,
    file_fingerprint: String // for file uniqueness discovery / to stop duplication
}
export default IDocument