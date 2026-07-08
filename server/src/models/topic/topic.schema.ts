import ITopic from "@/@types/interface/topic.interface.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema } from "mongoose";

const topicSchema = new Schema<ITopic>({
    description: SCHEMA_DEFINITION_PROPERTY.optionalNullString,
    order: SCHEMA_DEFINITION_PROPERTY.requiredNumber,
    title: SCHEMA_DEFINITION_PROPERTY.requiredString
})

export default topicSchema