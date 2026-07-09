import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";
import { UserRole } from "../constants/auth.constants.js";
import type { IUser } from "../types/auth.types.js";
import { hashPassword } from "../utils/password.util.js";

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: 8,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    avatar: {
      type: String,
      default: null,
      trim: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
      index: true,
    },
    last_login: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.password;
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      transform: (_doc, ret) => {
        delete ret.password;
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

UserSchema.pre("save", async function hashPasswordBeforeSave(
  this: HydratedDocument<IUser>,
  next,
) {
  if (!this.isModified("password")) {
    next();
    return;
  }

  this.password = await hashPassword(this.password);
  next();
});

export const UserModel =
  (mongoose.models.User as Model<IUser> | undefined) ||
  mongoose.model<IUser>("User", UserSchema);

export default UserModel;
