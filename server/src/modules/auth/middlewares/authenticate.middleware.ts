import type { RequestHandler } from "express";
import { ApiError } from "@/utils/apiError.js";
import userRepository from "../repositories/user.repository.js";
import { verifyAccessToken } from "../utils/jwt.util.js";

const extractBearerToken = (authorization?: string): string | null => {
  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const authenticate = (): RequestHandler => {
  return async (req, _res, next) => {
    try {
      const token = extractBearerToken(req.headers.authorization);

      if (!token) {
        throw new ApiError(401, "Authentication token is required");
      }

      const payload = verifyAccessToken(token);
      const user = await userRepository.findActiveById(payload.userId);

      if (!user) {
        throw new ApiError(401, "Authenticated user was not found");
      }

      req.user = {
        id: user._id.toString(),
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
