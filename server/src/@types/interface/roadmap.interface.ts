import { Types } from "mongoose";
import ITopic from "./topic.interface.js";

interface IRoadmap {
  _id?: Types.ObjectId;
  subject_id: Types.ObjectId;
  units: [
    {
      _id?: string;
      title: String;
      topics: ITopic[];
    },
  ];
  last_edited: Date;
}

export default IRoadmap;
