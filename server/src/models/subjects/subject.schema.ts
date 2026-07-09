import ISubject, {
  SUBJECT_DIFFICULTIES,
} from "@/@types/interface/subject.interface.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema } from "mongoose";

const SubjectSchema = new Schema<ISubject>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: SUBJECT_DIFFICULTIES,
    },
    teacher_id: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    thumbnail: SCHEMA_DEFINITION_PROPERTY.optionalNullString,
  },
  {
    timestamps: true,
  },
);

export default SubjectSchema;
