import { ObjectId } from "mongoose";
import { IRole } from "@/constants/role.constant.js";

export default interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: IRole;
}
