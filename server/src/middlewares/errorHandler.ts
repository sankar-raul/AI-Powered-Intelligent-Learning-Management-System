import type { ErrorRequestHandler } from "express";
import { ApiError } from "@/utils/apiError.js";
import appConfig from "@/config/config.js";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const isApiError = error instanceof ApiError;
  const statusCode = isApiError ? error.statusCode : 500;
  const message = isApiError ? error.message : "Internal server error";
  const errors = isApiError ? error.errors : undefined;

  if (!isApiError) {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors ?? (appConfig.isProduction ? undefined : error.message),
  });
};
