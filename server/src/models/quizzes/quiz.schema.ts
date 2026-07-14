import IQuiz from "@/@types/interface/quizzes.interface.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema, VirtualTypeOptions } from "mongoose";
import { GENERAL_SCHEMA_OPTIONS, VIRTUAL_SCHEMA_OPTIONS } from "@/config/schemaOptions.js";

const quizeSchema = new Schema<IQuiz>({
    questions: [{
        question: SCHEMA_DEFINITION_PROPERTY.requiredString,
        options: [SCHEMA_DEFINITION_PROPERTY.requiredString],
        answer: SCHEMA_DEFINITION_PROPERTY.requiredString,
        explanation: SCHEMA_DEFINITION_PROPERTY.requiredString
    }],
    subjectId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    title: SCHEMA_DEFINITION_PROPERTY.requiredString,
    topicId: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
}, {
    ...GENERAL_SCHEMA_OPTIONS,
    ...VIRTUAL_SCHEMA_OPTIONS
})

const topicVirtualReference: VirtualTypeOptions<IQuiz> = {
    ref: "roadmaps",
    localField: "topicId",
    foreignField: "_id",
    justOne: true,
}

quizeSchema.virtual("topic_details", topicVirtualReference);

export default quizeSchema