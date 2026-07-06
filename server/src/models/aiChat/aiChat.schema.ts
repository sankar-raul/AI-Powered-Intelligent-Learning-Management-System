import IAiChat, { AICHATROLES } from "@/@types/interface/aichat.interface.js";
import { Schema, Types } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    role: { type: String, enum: AICHATROLES, required: true },
    content: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
    doc_refs: {
      type: [
        {
          doc_id: { type: Types.ObjectId, required: true },
          doc_page: { type: Number, default: null },
        },
      ],
      default: [],
    },
  },
  { _id: false },
);

const AiChatSchema = new Schema<IAiChat>(
  {
    userId: { type: Types.ObjectId, required: true, ref: "users" },
    subjectId: { type: Types.ObjectId, required: true, ref: "subject" },
    topicId: { type: Types.ObjectId, default: null },
    messages: { type: [ChatMessageSchema], default: [] },
  },
  { timestamps: true },
);

AiChatSchema.index({ userId: 1, subjectId: 1, topicId: 1 }, { unique: true });

export default AiChatSchema;
