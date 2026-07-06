import IUser from "@/@types/interface/user.interface.js";
import ROLE from "@/constants/role.constant.js";
import { Schema } from "mongoose";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(ROLE),
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default UserSchema;
