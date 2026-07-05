import { ObjectId } from "mongoose";
import ROLE from "@/constants/role.constant.js"
export default interface IUser {
    _id?: ObjectId,
    name: String,
    email: String,
    password: String,
    // role: 
}