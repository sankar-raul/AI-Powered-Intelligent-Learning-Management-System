import mongoose, { Schema, type Model } from "mongoose";
import type { IPasswordResetToken } from "../types/auth.types.js";

const PasswordResetTokenSchema = new Schema<IPasswordResetToken>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expires_at: {
      type: Date,
      required: true,
      index: true,
    },
    used_at: {
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
  },
);

PasswordResetTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const PasswordResetTokenModel =
  (mongoose.models.PasswordResetToken as Model<IPasswordResetToken> | undefined) ||
  mongoose.model<IPasswordResetToken>(
    "PasswordResetToken",
    PasswordResetTokenSchema,
  );

export default PasswordResetTokenModel;
