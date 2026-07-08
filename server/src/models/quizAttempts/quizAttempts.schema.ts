import IQuizAttempts from "@/@types/interface/quizAttempts.interface.js";
import {
  GENERAL_SCHEMA_OPTIONS,
  VIRTUAL_SCHEMA_OPTIONS,
} from "@/config/schemaOptions.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema, VirtualTypeOptions } from "mongoose";
import QuizeModel from "../quizzes/quiz.model.js";

const quizAttemptsSchema: Schema<IQuizAttempts> = new Schema<IQuizAttempts>(
  {
    quizId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    studentId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    score: SCHEMA_DEFINITION_PROPERTY.requiredNumber,
    submittedAt: SCHEMA_DEFINITION_PROPERTY.requiredDate,
    answers: [SCHEMA_DEFINITION_PROPERTY.requiredString],
  },
  {
    ...GENERAL_SCHEMA_OPTIONS,
    ...VIRTUAL_SCHEMA_OPTIONS,
  },
);

const quizVirtualReference: VirtualTypeOptions<IQuizAttempts> = {
  ref: QuizeModel,
  localField: "quizId",
  foreignField: "_id",
  justOne: true,
};

quizAttemptsSchema.virtual("quiz_details", quizVirtualReference);

export default quizAttemptsSchema;
