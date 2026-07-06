import { NextFunction, Request, Response } from "express";
import { IRole } from "@/constants/role.constant.js";
import authService from "@/services/auth.service.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    req.user = authService.verify(token);
    next();
  } catch (_error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const requireRole = (...roles: IRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!roles.includes(req.user.role as IRole)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};
