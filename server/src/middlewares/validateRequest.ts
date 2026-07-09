import type { RequestHandler } from "express";
import { ZodError, type ZodSchema } from "zod";
import { ApiError } from "@/utils/apiError.js";

export const validateRequest = (schema: ZodSchema): RequestHandler => {
  return (req, _res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
        cookies: req.cookies,
      }) as {
        body?: unknown;
        params?: unknown;
        query?: unknown;
        cookies?: unknown;
      };

      if (parsed.body) {
        req.body = parsed.body;
      }

      if (parsed.query) {
        req.query = parsed.query as typeof req.query;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ApiError(400, "Validation failed", error.issues));
        return;
      }

      next(error);
    }
  };
};
