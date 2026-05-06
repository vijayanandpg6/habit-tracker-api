import { body, param } from 'express-validator';

const clientUpdatedAt = body('clientUpdatedAt')
  .isISO8601()
  .withMessage('clientUpdatedAt must be a valid ISO 8601 timestamp');

export const createHabitValidator = [
  body('title').isString().trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().isString().trim().isLength({ max: 1000 }),
  clientUpdatedAt,
];

export const updateHabitValidator = [
  param('id').isMongoId().withMessage('Invalid habit ID'),
  body('title').optional().isString().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().isString().trim().isLength({ max: 1000 }),
  clientUpdatedAt,
];

export const habitIdValidator = [param('id').isMongoId().withMessage('Invalid habit ID')];

export const checkInValidator = [
  param('id').isMongoId().withMessage('Invalid habit ID'),
  clientUpdatedAt,
];
