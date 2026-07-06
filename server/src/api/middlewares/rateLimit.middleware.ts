import { NextFunction, Request, Response } from "express";

interface RateLimiterOptions {
  windowMs?: number;
  limit?: number;
}

const createRateLimiter = (options: RateLimiterOptions = {}) => {
  const windowMs = options.windowMs ?? 60_000;
  const limit = options.limit ?? 120;
  const store = new Map<string, { count: number; resetAt: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    const current = store.get(key);

    if (!current || now > current.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (current.count >= limit) {
      res.status(429).json({ message: "Too many requests. Please try again shortly." });
      return;
    }

    current.count += 1;
    store.set(key, current);
    next();
  };
};

export default createRateLimiter;
