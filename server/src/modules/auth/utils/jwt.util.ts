import jwt from "jsonwebtoken";
import appConfig from "@/config/config.js";
import { ApiError } from "@/utils/apiError.js";
import { AUTH_TOKEN_EXPIRY, UserRole } from "../constants/auth.constants.js";
import type { AuthJwtPayload } from "../types/auth.types.js";

const signToken = (
  payload: AuthJwtPayload,
  secret: string,
  expiresInSeconds: number,
): string => {
  return jwt.sign(payload, secret, { expiresIn: expiresInSeconds });
};

const verifyToken = (token: string, secret: string): AuthJwtPayload => {
  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded !== "object" ||
      typeof decoded.userId !== "string" ||
      typeof decoded.email !== "string" ||
      !Object.values(UserRole).includes(decoded.role as UserRole)
    ) {
      throw new ApiError(401, "Invalid token payload");
    }

    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role as UserRole,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(401, "Invalid or expired token");
  }
};

export const generateAccessToken = (payload: AuthJwtPayload): string => {
  return signToken(
    payload,
    appConfig.auth.accessTokenSecret,
    AUTH_TOKEN_EXPIRY.ACCESS_TOKEN_SECONDS,
  );
};

export const generateRefreshToken = (payload: AuthJwtPayload): string => {
  return signToken(
    payload,
    appConfig.auth.refreshTokenSecret,
    AUTH_TOKEN_EXPIRY.REFRESH_TOKEN_SECONDS,
  );
};

export const verifyAccessToken = (token: string): AuthJwtPayload => {
  return verifyToken(token, appConfig.auth.accessTokenSecret);
};

export const verifyRefreshToken = (token: string): AuthJwtPayload => {
  return verifyToken(token, appConfig.auth.refreshTokenSecret);
};
