import crypto from "crypto";

export const generateSecureToken = (bytes = 32): string => {
  return crypto.randomBytes(bytes).toString("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const addMinutes = (minutes: number): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

export const addSeconds = (seconds: number): Date => {
  return new Date(Date.now() + seconds * 1000);
};
