import { NextFunction, Request, Response } from "express";
import authService from "@/services/auth.service.js";

const softAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    next();
    return;
  }

  try {
    req.user = authService.verify(token);
  } catch (_error) {
    req.user = undefined;
  }

  next();
};

export default softAuth;
