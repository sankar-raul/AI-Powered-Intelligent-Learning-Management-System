import IDocument, { DOC_TYPE, type DocumentType } from "@/@types/interface/document.interface.js";
import { GENERAL_SCHEMA_OPTIONS } from "@/config/schemaOptions.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema } from "mongoose";

const documentSchema = new Schema<IDocument>({
    file_fingerprint: SCHEMA_DEFINITION_PROPERTY.requiredString,
    file_users_count: SCHEMA_DEFINITION_PROPERTY.requiredNumber,
    type: {
        type: String,
        enum: DOC_TYPE,
        required: true
    },
    uploadedAt: SCHEMA_DEFINITION_PROPERTY.requiredDate,
    url: SCHEMA_DEFINITION_PROPERTY.requiredString,
    size: SCHEMA_DEFINITION_PROPERTY.requiredNumber
},
{ ...GENERAL_SCHEMA_OPTIONS }
)

export default documentSchema