import { Request, Response, NextFunction } from "express";

/**
 * Custom error class for intentional business logic errors.
 * Allows controllers to return specific HTTP status codes.
 */
export class AppError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Global error handler middleware.
 * Must be registered LAST in index.ts after all routes.
 * - AppError → returns specific statusCode (400, 404, etc.)
 * - Unknown errors → returns 500
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(`[Error] ${err.message}`);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
};