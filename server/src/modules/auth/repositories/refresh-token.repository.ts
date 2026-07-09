import type { HydratedDocument, Types } from "mongoose";
import RefreshTokenModel from "../schemas/refresh-token.schema.js";
import type { IRefreshToken } from "../types/auth.types.js";

export interface CreateRefreshTokenInput {
  user_id: Types.ObjectId;
  token: string;
  expires_at: Date;
  device_info?: string | null;
  ip_address?: string | null;
}

export class RefreshTokenRepository {
  async create(
    data: CreateRefreshTokenInput,
  ): Promise<HydratedDocument<IRefreshToken>> {
    return RefreshTokenModel.create(data);
  }

  async findValidToken(
    token: string,
  ): Promise<HydratedDocument<IRefreshToken> | null> {
    return RefreshTokenModel.findOne({
      token,
      is_revoked: false,
      expires_at: { $gt: new Date() },
    }).exec();
  }

  async revokeByToken(token: string): Promise<void> {
    await RefreshTokenModel.updateOne(
      { token },
      { $set: { is_revoked: true } },
    ).exec();
  }

  async deleteByToken(token: string): Promise<void> {
    await RefreshTokenModel.deleteOne({ token }).exec();
  }

  async revokeAllForUser(userId: string | Types.ObjectId): Promise<void> {
    await RefreshTokenModel.updateMany(
      { user_id: userId, is_revoked: false },
      { $set: { is_revoked: true } },
    ).exec();
  }

  async deleteAllForUser(userId: string | Types.ObjectId): Promise<void> {
    await RefreshTokenModel.deleteMany({ user_id: userId }).exec();
  }
}

export default new RefreshTokenRepository();
