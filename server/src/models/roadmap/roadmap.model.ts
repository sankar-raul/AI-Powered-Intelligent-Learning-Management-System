import IRoadmap from "@/@types/interface/roadmap.interface.js";
import { model } from "mongoose";
import RoadmapSchema from "./roadmap.schema.js";

const RoadmapModel = model<IRoadmap>("roadmaps", RoadmapSchema)

export default RoadmapModel