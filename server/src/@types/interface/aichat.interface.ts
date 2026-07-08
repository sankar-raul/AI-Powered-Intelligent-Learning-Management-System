import { Types } from "mongoose";

export const AICHATROLES = ["user", "system"] as const;
export type AiChatRoleType = (typeof AICHATROLES)[number];

interface IAiChat {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  subjectId: Types.ObjectId;
  topicId?: Types.ObjectId;
  messages: [
    {
      role: AiChatRoleType;
      content: String;
      timestamp: Date;
      doc_refs: [
        {
          doc_id: Types.ObjectId;
          doc_page?: number | null | undefined;
        },
      ];
    },
  ];
}

export default IAiChat;
