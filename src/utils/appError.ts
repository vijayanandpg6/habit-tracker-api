import { HTTP_STATUS } from '../constants';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    public readonly isOperational = true,
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}
