import { Types } from "mongoose";
import ITopic from "./topic.interface.js";

interface IRoadmapUnit {
  title: string;
  order: number;
  topics: ITopic[];
}

interface IRoadmap {
  _id?: Types.ObjectId;
  subject_id: Types.ObjectId;
  units: IRoadmapUnit[];
  last_edited?: Date;
}

export type { IRoadmapUnit };
export default IRoadmap;
