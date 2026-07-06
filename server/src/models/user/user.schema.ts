import IUser from "@/@types/interface/user.interface.js";
import ROLE from "@/constants/role.constant.js";
import mongoose, { Mongoose, Schema, Types } from "mongoose";

const UserSchema = new Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(ROLE)
    }
}, {
    timestamps: true
})

export default UserSchema;