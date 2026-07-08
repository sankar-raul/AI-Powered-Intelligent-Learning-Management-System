import ITopic from "@/@types/interface/topic.interface.js";
import { model } from "mongoose";
import topicSchema from "./topic.schema.js";

const TopicModel = model<ITopic>("topics", topicSchema)

export default TopicModel