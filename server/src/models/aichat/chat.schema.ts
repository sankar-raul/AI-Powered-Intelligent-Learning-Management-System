import IAiChat, { AICHATROLES } from "@/@types/interface/aichat.interface.js";
import { GENERAL_SCHEMA_OPTIONS } from "@/config/schemaOptions.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema } from "mongoose";
import DocumentModel from "../document/document.model.js";

const aichatSchema: Schema<IAiChat> = new Schema<IAiChat>(
  {
    subjectId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    userId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    topicId: SCHEMA_DEFINITION_PROPERTY.optionalNullObjectId,
    messages: [
      {
        role: {
          ...SCHEMA_DEFINITION_PROPERTY.requiredString,
          enum: AICHATROLES,
        },
        content: SCHEMA_DEFINITION_PROPERTY.requiredString,
        timeStamp: SCHEMA_DEFINITION_PROPERTY.requiredDate,
        doc_refs: [
          {
            doc_id: {
              ...SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
              ref: DocumentModel.modelName,
            },
            doc_page: SCHEMA_DEFINITION_PROPERTY.optionalNullNumber,
          },
        ],
      },
    ],
  },
  {
    ...GENERAL_SCHEMA_OPTIONS,
  },
);

export default aichatSchema;
