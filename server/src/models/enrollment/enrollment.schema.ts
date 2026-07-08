import IEnrollment from "@/@types/interface/enrollment.interface.js";
import {
  GENERAL_SCHEMA_OPTIONS,
  VIRTUAL_SCHEMA_OPTIONS,
} from "@/config/schemaOptions.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema, VirtualTypeOptions } from "mongoose";
import SubjectModel from "../subjects/subject.model.js";

const enrollmentSchema = new Schema<IEnrollment>(
  {
    studentId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    subjectId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    lastAccessed: SCHEMA_DEFINITION_PROPERTY.requiredDate,
    progress: SCHEMA_DEFINITION_PROPERTY.optionalNullNumber,
  },
  {
    ...GENERAL_SCHEMA_OPTIONS,
    ...VIRTUAL_SCHEMA_OPTIONS,
  },
);

const subjectVirtualReference: VirtualTypeOptions<IEnrollment> = {
  ref: SubjectModel,
  localField: "subjectId",
  foreignField: "_id",
  justOne: true,
};

enrollmentSchema.virtual("subject_info", subjectVirtualReference);

export default enrollmentSchema;
