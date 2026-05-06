import { Request, Response } from 'express';
import { HTTP_STATUS } from '../constants';

export const notFoundMiddleware = (req: Request, res: Response): void => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};
