import type { Request } from "express";
import { sendSuccess } from "@/utils/apiResponse.js";
import { asyncHandler } from "@/middlewares/asyncHandler.js";
import { COOKIE_NAMES, AUTH_MESSAGES } from "../constants/auth.constants.js";
import authService from "../services/auth.service.js";
import { clearCookieOptions, cookieOptions } from "../utils/cookie.util.js";

const getDeviceMetadata = (req: Request) => ({
  device_info: req.get("user-agent") ?? null,
  ip_address: req.ip ?? null,
});

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return sendSuccess(res, 201, AUTH_MESSAGES.REGISTERED, { user });
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, getDeviceMetadata(req));

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, cookieOptions());

  return sendSuccess(res, 200, AUTH_MESSAGES.LOGGED_IN, {
    accessToken: result.accessToken,
    user: result.user,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] as
    | string
    | undefined;
  const result = await authService.refresh(refreshToken ?? "", getDeviceMetadata(req));

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, result.refreshToken, cookieOptions());

  return sendSuccess(res, 200, AUTH_MESSAGES.TOKEN_REFRESHED, {
    accessToken: result.accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.[COOKIE_NAMES.REFRESH_TOKEN] as
    | string
    | undefined;

  await authService.logout(refreshToken);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, clearCookieOptions());

  return sendSuccess(res, 200, AUTH_MESSAGES.LOGGED_OUT);
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authService.logoutAll(req.user!.id);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, clearCookieOptions());

  return sendSuccess(res, 200, AUTH_MESSAGES.LOGGED_OUT_ALL);
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user!.id);

  return sendSuccess(res, 200, AUTH_MESSAGES.PROFILE_FETCHED, { user });
});

export const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user!.id, req.body);
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, clearCookieOptions());

  return sendSuccess(res, 200, AUTH_MESSAGES.PASSWORD_CHANGED);
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);

  return sendSuccess(res, 200, AUTH_MESSAGES.PASSWORD_RESET_REQUESTED, result);
});

export const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body);

  return sendSuccess(res, 200, AUTH_MESSAGES.PASSWORD_RESET_SUCCESS);
});
