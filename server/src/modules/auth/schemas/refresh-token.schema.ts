import mongoose, { Schema, type Model } from "mongoose";
import type { IRefreshToken } from "../types/auth.types.js";

const RefreshTokenSchema = new Schema<IRefreshToken>(
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
    device_info: {
      type: String,
      default: null,
      trim: true,
    },
    ip_address: {
      type: String,
      default: null,
      trim: true,
    },
    is_revoked: {
      type: Boolean,
      default: false,
      index: true,
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

RefreshTokenSchema.index({ user_id: 1, is_revoked: 1 });
RefreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel =
  (mongoose.models.RefreshToken as Model<IRefreshToken> | undefined) ||
  mongoose.model<IRefreshToken>("RefreshToken", RefreshTokenSchema);

export default RefreshTokenModel;
