import IUser from "@/@types/interface/user.interface.js";
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
}, {
    timestamps: true
})

export default UserSchema;