import { model } from "mongoose";
import UserSchema from "./user.schema.js";
import IUser from "@/@types/interface/user.interface.js";

const UserModel = model<IUser>("users", UserSchema)

export default UserModel