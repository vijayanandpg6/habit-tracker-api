import { body, param } from 'express-validator';

const clientUpdatedAt = body('clientUpdatedAt')
  .isISO8601()
  .withMessage('clientUpdatedAt must be a valid ISO 8601 timestamp');

export const createTaskValidator = [
  body('title').isString().trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
  body('description').optional().isString().trim().isLength({ max: 1000 }),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid ISO 8601 date'),
  body('completed').optional().isBoolean(),
  clientUpdatedAt,
];

export const updateTaskValidator = [
  param('id').isMongoId().withMessage('Invalid task ID'),
  body('title').optional().isString().trim().notEmpty().isLength({ max: 200 }),
  body('description').optional().isString().trim().isLength({ max: 1000 }),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid ISO 8601 date'),
  body('completed').optional().isBoolean(),
  clientUpdatedAt,
];

export const taskIdValidator = [param('id').isMongoId().withMessage('Invalid task ID')];
