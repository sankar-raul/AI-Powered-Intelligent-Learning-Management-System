import type { Response } from "express";

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T | null = null,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
