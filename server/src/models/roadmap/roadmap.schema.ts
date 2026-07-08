import IRoadmap from "@/@types/interface/roadmap.interface.js";
import ITopic from "@/@types/interface/topic.interface.js";
import { Schema, Types } from "mongoose";

const RoadmapSchema = new Schema<IRoadmap>(
  {
    last_edited: {
      type: Date,
    },
    subject_id: {
      type: Types.ObjectId,
      required: true,
    },
    units: [
      {
        title: String,
        topics: [
          {
            title: String,
            description: String,
            order: Number,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default RoadmapSchema;
