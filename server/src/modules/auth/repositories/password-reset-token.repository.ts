import type { HydratedDocument, Types } from "mongoose";
import PasswordResetTokenModel from "../schemas/password-reset-token.schema.js";
import type { IPasswordResetToken } from "../types/auth.types.js";

export interface CreatePasswordResetTokenInput {
  user_id: Types.ObjectId;
  token: string;
  expires_at: Date;
}

export class PasswordResetTokenRepository {
  async create(
    data: CreatePasswordResetTokenInput,
  ): Promise<HydratedDocument<IPasswordResetToken>> {
    return PasswordResetTokenModel.create(data);
  }

  async findValidToken(
    token: string,
  ): Promise<HydratedDocument<IPasswordResetToken> | null> {
    return PasswordResetTokenModel.findOne({
      token,
      used_at: null,
      expires_at: { $gt: new Date() },
    }).exec();
  }

  async revokeUnusedForUser(userId: string | Types.ObjectId): Promise<void> {
    await PasswordResetTokenModel.updateMany(
      { user_id: userId, used_at: null },
      { $set: { used_at: new Date() } },
    ).exec();
  }

  async markUsed(token: string): Promise<void> {
    await PasswordResetTokenModel.updateOne(
      { token },
      { $set: { used_at: new Date() } },
    ).exec();
  }
}

export default new PasswordResetTokenRepository();
