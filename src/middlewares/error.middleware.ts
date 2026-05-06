import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { AppError } from '../utils/appError';
import { HTTP_STATUS } from '../constants';
import { logger } from '../lib/logger';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void => {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
    });
    return;
  }

  if ((err as { code?: number }).code === 11000) {
    res.status(HTTP_STATUS.CONFLICT).json({ success: false, message: 'Duplicate entry' });
    return;
  }

  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong',
  });
};
