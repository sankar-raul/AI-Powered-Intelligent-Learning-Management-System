import type { CookieOptions } from "express";
import appConfig from "@/config/config.js";
import { AUTH_TOKEN_EXPIRY } from "../constants/auth.constants.js";

export const cookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: appConfig.isProduction,
  sameSite: "lax",
  maxAge: AUTH_TOKEN_EXPIRY.REFRESH_TOKEN_MS,
  path: "/",
});

export const clearCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: appConfig.isProduction,
  sameSite: "lax",
  path: "/",
});
