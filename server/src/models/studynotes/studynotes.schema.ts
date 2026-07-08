import IStudynotes from "@/@types/interface/studynotes.interface.js";
import { GENERAL_SCHEMA_OPTIONS, VIRTUAL_SCHEMA_OPTIONS } from "@/config/schemaOptions.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema, VirtualTypeOptions } from "mongoose";
import DocumentModel from "../document/document.model.js";

const studyNotesSchema = new Schema<IStudynotes>({
    file_id: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    subjectId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    title: SCHEMA_DEFINITION_PROPERTY.requiredString,
    uploadedAt: SCHEMA_DEFINITION_PROPERTY.requiredDate,
    uploadedBy: SCHEMA_DEFINITION_PROPERTY.requiredObjectId
}, {
    ...VIRTUAL_SCHEMA_OPTIONS,
    ...GENERAL_SCHEMA_OPTIONS,
})

const documentVirtualReference: VirtualTypeOptions<IStudynotes> =
  {
    ref: DocumentModel,
    localField: "file_id",
    foreignField: "_id",
    justOne: true,
  };

studyNotesSchema.virtual(
  "file_info",
  documentVirtualReference
);

export default studyNotesSchema