export enum UserRole {
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export const AUTH_TOKEN_EXPIRY = {
  ACCESS_TOKEN_SECONDS: 15 * 60,
  REFRESH_TOKEN_SECONDS: 30 * 24 * 60 * 60,
  REFRESH_TOKEN_MS: 30 * 24 * 60 * 60 * 1000,
} as const;

export const COOKIE_NAMES = {
  REFRESH_TOKEN: "refreshToken",
} as const;

export const PASSWORD_SECURITY = {
  SALT_ROUNDS: 12,
} as const;

export const PASSWORD_RESET = {
  TOKEN_BYTES: 32,
  EXPIRES_IN_MINUTES: 15,
} as const;

export const AUTH_MESSAGES = {
  REGISTERED: "User registered successfully",
  LOGGED_IN: "Logged in successfully",
  TOKEN_REFRESHED: "Token refreshed successfully",
  LOGGED_OUT: "Logged out successfully",
  LOGGED_OUT_ALL: "Logged out from all devices successfully",
  PROFILE_FETCHED: "Authenticated user fetched successfully",
  PASSWORD_CHANGED: "Password changed successfully. Please log in again.",
  PASSWORD_RESET_REQUESTED:
    "If an account exists for this email, password reset instructions have been sent.",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
} as const;
