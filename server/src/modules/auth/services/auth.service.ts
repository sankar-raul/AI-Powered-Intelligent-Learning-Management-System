import type { HydratedDocument } from "mongoose";
import appConfig from "@/config/config.js";
import { ApiError } from "@/utils/apiError.js";
import {
  AUTH_MESSAGES,
  AUTH_TOKEN_EXPIRY,
  PASSWORD_RESET,
} from "../constants/auth.constants.js";
import passwordResetTokenRepository from "../repositories/password-reset-token.repository.js";
import refreshTokenRepository from "../repositories/refresh-token.repository.js";
import userRepository from "../repositories/user.repository.js";
import type {
  AuthJwtPayload,
  DeviceMetadata,
  ForgotPasswordResult,
  IUser,
  IUserResponse,
  LoginResult,
  RefreshResult,
} from "../types/auth.types.js";
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
} from "../validators/auth.validator.js";
import { comparePassword } from "../utils/password.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";
import { addMinutes, addSeconds, generateSecureToken, hashToken } from "../utils/token.util.js";

const DUMMY_PASSWORD_HASH =
  "$2b$12$rgvgZc4ILLjdvtgmIQRJTOJa5eFrEK3W8K4CbLH2zTPZyV9kh4cNa";

const toUserResponse = (user: HydratedDocument<IUser>): IUserResponse => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  is_verified: user.is_verified,
  is_active: user.is_active,
  last_login: user.last_login,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

export class AuthService {
  async register(input: RegisterInput): Promise<IUserResponse> {
    const existingUser = await userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ApiError(409, "Email is already registered");
    }

    try {
      const user = await userRepository.create(input);
      return toUserResponse(user);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === 11000
      ) {
        throw new ApiError(409, "Email is already registered");
      }

      throw error;
    }
  }

  async login(input: LoginInput, metadata: DeviceMetadata): Promise<LoginResult> {
    const user = await userRepository.findByEmail(input.email, true);
    const passwordHash = user?.password ?? DUMMY_PASSWORD_HASH;
    const isPasswordValid = await comparePassword(input.password, passwordHash);

    if (!user || !user.is_active || !isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const tokens = await this.issueTokens(user, metadata);
    await userRepository.updateLastLogin(user._id);

    const latestUser = await userRepository.findById(user._id);

    return {
      ...tokens,
      user: toUserResponse(latestUser ?? user),
    };
  }

  async refresh(refreshToken: string, metadata: DeviceMetadata): Promise<RefreshResult> {
    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = hashToken(refreshToken);
    const storedToken = await refreshTokenRepository.findValidToken(tokenHash);

    if (!storedToken || storedToken.user_id.toString() !== payload.userId) {
      await refreshTokenRepository.revokeAllForUser(payload.userId);
      throw new ApiError(401, "Invalid refresh token");
    }

    const user = await userRepository.findActiveById(payload.userId);

    if (!user) {
      await refreshTokenRepository.revokeByToken(tokenHash);
      throw new ApiError(401, "Authenticated user was not found");
    }

    await refreshTokenRepository.revokeByToken(tokenHash);
    return this.issueTokens(user, metadata);
  }

  async logout(refreshToken?: string): Promise<void> {
    if (!refreshToken) {
      return;
    }

    await refreshTokenRepository.deleteByToken(hashToken(refreshToken));
  }

  async logoutAll(userId: string): Promise<void> {
    await refreshTokenRepository.deleteAllForUser(userId);
  }

  async getMe(userId: string): Promise<IUserResponse> {
    const user = await userRepository.findActiveById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return toUserResponse(user);
  }

  async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {
    const user = await userRepository.findById(userId, true);

    if (!user || !user.is_active) {
      throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await comparePassword(
      input.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }

    await userRepository.updatePassword(userId, input.newPassword);
    await refreshTokenRepository.revokeAllForUser(userId);
  }

  async forgotPassword(input: ForgotPasswordInput): Promise<ForgotPasswordResult> {
    const user = await userRepository.findByEmail(input.email);
    const resetToken = generateSecureToken(PASSWORD_RESET.TOKEN_BYTES);
    const tokenHash = hashToken(resetToken);
    const expiresAt = addMinutes(PASSWORD_RESET.EXPIRES_IN_MINUTES);

    if (user?.is_active) {
      await passwordResetTokenRepository.revokeUnusedForUser(user._id);
      await passwordResetTokenRepository.create({
        user_id: user._id,
        token: tokenHash,
        expires_at: expiresAt,
      });
    }

    if (appConfig.isProduction || !user?.is_active) {
      return {};
    }

    return {
      resetToken,
      expiresAt,
    };
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    const tokenHash = hashToken(input.token);
    const resetToken = await passwordResetTokenRepository.findValidToken(tokenHash);

    if (!resetToken) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    const user = await userRepository.findActiveById(resetToken.user_id);

    if (!user) {
      await passwordResetTokenRepository.markUsed(tokenHash);
      throw new ApiError(400, "Invalid or expired reset token");
    }

    await userRepository.updatePassword(user._id, input.newPassword);
    await refreshTokenRepository.revokeAllForUser(user._id);
    await passwordResetTokenRepository.markUsed(tokenHash);
  }

  private async issueTokens(
    user: HydratedDocument<IUser>,
    metadata: DeviceMetadata,
  ): Promise<RefreshResult> {
    const payload: AuthJwtPayload = {
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await refreshTokenRepository.create({
      user_id: user._id,
      token: hashToken(refreshToken),
      expires_at: addSeconds(AUTH_TOKEN_EXPIRY.REFRESH_TOKEN_SECONDS),
      device_info: metadata.device_info,
      ip_address: metadata.ip_address,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();
export { AUTH_MESSAGES };
export default authService;
