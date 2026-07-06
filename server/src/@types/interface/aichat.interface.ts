import { Types } from "mongoose";

export const AICHATROLES = ["user", "system"] as const;
export type AiChatRoleType = (typeof AICHATROLES)[number];

interface IAiChatMessage {
  role: AiChatRoleType;
  content: string;
  timestamp: Date;
  doc_refs?: {
    doc_id: Types.ObjectId;
    doc_page?: number | null;
  }[];
}

interface IAiChat {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  subjectId: Types.ObjectId;
  topicId?: Types.ObjectId;
  messages: IAiChatMessage[];
}

export type { IAiChatMessage };
export default IAiChat;
