import { Types } from "mongoose"

export const NOTES_TYPES = ['pdf', 'doc', 'image'] as const
export type TNotesType = (typeof NOTES_TYPES)[number]
interface IStudynotes {
    _id?: Types.ObjectId,
    subjectId: Types.ObjectId,
    title: String,
    file_id: Types.ObjectId,
    uploadedBy: Types.ObjectId,
    uploadedAt: Date,
}
export default IStudynotes