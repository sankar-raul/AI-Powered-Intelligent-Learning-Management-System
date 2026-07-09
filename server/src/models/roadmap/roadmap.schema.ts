import IRoadmap from "@/@types/interface/roadmap.interface.js";
import { GENERAL_SCHEMA_OPTIONS } from "@/config/schemaOptions.js";
import SCHEMA_DEFINITION_PROPERTY from "@/constants/model.constant.js";
import { Schema } from "mongoose";

const RoadmapSchema: Schema<IRoadmap> = new Schema<IRoadmap>(
  {
    last_edited: SCHEMA_DEFINITION_PROPERTY.requiredDate,
    subject_id: SCHEMA_DEFINITION_PROPERTY.requiredObjectId,
    units: [
      {
        title: SCHEMA_DEFINITION_PROPERTY.requiredString,
        topics: [
          {
            title: SCHEMA_DEFINITION_PROPERTY.requiredString,
            description: SCHEMA_DEFINITION_PROPERTY.requiredString,
            order: SCHEMA_DEFINITION_PROPERTY.requiredNumber,
          },
        ],
      },
    ],
  },
  {
    ...GENERAL_SCHEMA_OPTIONS,
  },
);

export default RoadmapSchema;
