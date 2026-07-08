import IDocument from "@/@types/interface/document.interface.js";
import { model } from "mongoose";
import documentSchema from "./document.schema.js";

const DocumentModel = model<IDocument>("documents", documentSchema);

export default DocumentModel