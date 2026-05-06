import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUS } from '../constants';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(HTTP_STATUS.UNPROCESSABLE_ENTITY).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.type === 'field' ? e.path : e.type, message: e.msg })),
    });
    return;
  }
  next();
};
