import { login, me } from "../auth/auth.api";
import { sendMessage } from "./chat/chat.api";
import { fileUpload } from "./fileUpload/fileUpload";
import { getAllDocuments, getDocumentById, deleteDocument } from "./document/documents.api";

export const api = {
  document: {
    fileUpload,
    getAll: getAllDocuments,
    getById: getDocumentById,
    delete: deleteDocument,
  },
  auth: {
    me,
    login
  },
  chat: {
    sendMessage,
  }
};
