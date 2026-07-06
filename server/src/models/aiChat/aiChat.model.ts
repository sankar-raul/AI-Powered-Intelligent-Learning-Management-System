import IAiChat from "@/@types/interface/aichat.interface.js";
import { model } from "mongoose";
import AiChatSchema from "./aiChat.schema.js";

const AiChatModel = model<IAiChat>("aiChats", AiChatSchema);

export default AiChatModel;
