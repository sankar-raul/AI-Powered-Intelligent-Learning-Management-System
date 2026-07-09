import type { RequestHandler } from "express";
import { ApiError } from "@/utils/apiError.js";
import { UserRole } from "../constants/auth.constants.js";

type RoleInput = UserRole | keyof typeof UserRole;

const normalizeRole = (role: RoleInput): UserRole => {
  if (role in UserRole) {
    return UserRole[role as keyof typeof UserRole];
  }

  return role as UserRole;
};

export const authorize = (...roles: RoleInput[]): RequestHandler => {
  const allowedRoles = roles.map(normalizeRole);

  return (req, _res, next) => {
    if (!req.user) {
      next(new ApiError(401, "Authentication is required"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ApiError(403, "You do not have permission to access this resource"));
      return;
    }

    next();
  };
};
