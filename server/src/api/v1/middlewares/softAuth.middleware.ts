import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import appConfig from "@/config/config.js";
import { IUserToken } from "@/@types/interface/userToken.interface.js";

export const softAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, appConfig.auth.accessTokenSecret) as IUserToken;
    req.user = decoded;
    next();
  } catch (error) {
    console.warn("Soft Auth check failed or token expired:", error);
    // Proceed without attaching user since it is a soft auth check
    next();
  }
};

export default softAuth;
