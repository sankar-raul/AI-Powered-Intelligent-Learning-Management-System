import { Types } from "mongoose";

interface ITopic {
  _id?: Types.ObjectId;
  title: string;
  description: string;
  order: number;
}

export default ITopic;
