import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import appConfig from "@/config/config.js";
import { IUserToken } from "@/@types/interface/userToken.interface.js";

export const hashText = async (text: string) => {
  return bcrypt.hash(text, 12);
};

export const matchHash = async (text: string, hash: string) => {
  return bcrypt.compare(text, hash);
};

export const signAccessToken = (payload: IUserToken, expiresIn: SignOptions["expiresIn"]) => {
  const secret = appConfig.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is missing");
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyAccessToken = (token: string): IUserToken => {
  const secret = appConfig.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT secret is missing");
  }

  return jwt.verify(token, secret) as IUserToken;
};
