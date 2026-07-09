import mongoose from "mongoose";

interface ITopic {
  _id?: mongoose.Types.ObjectId;
  title: String;
  description: String;
  order: number;
  eastimated_study_time: number;
  difficulty: String;
}
export default ITopic;
