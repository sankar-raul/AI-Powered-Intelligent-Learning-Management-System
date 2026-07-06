import IRoadmap from "@/@types/interface/roadmap.interface.js";
import { Schema, Types } from "mongoose";

const TopicSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
  },
  { _id: true },
);

const UnitSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    topics: { type: [TopicSchema], default: [] },
  },
  { _id: false },
);

const RoadmapSchema = new Schema<IRoadmap>(
  {
    last_edited: {
      type: Date,
      default: Date.now,
    },
    subject_id: {
      type: Types.ObjectId,
      required: true,
      unique: true,
      ref: "subject",
    },
    units: {
      type: [UnitSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

RoadmapSchema.index({ subject_id: 1 });

export default RoadmapSchema;
