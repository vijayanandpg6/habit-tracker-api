import rateLimit from 'express-rate-limit';
import { RATE_LIMIT, HTTP_STATUS } from '../constants';

const rateLimitResponse = (message: string) => ({
  success: false,
  message,
});

export const globalRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.GLOBAL_WINDOW_MS,
  max: RATE_LIMIT.GLOBAL_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many requests, please try again later'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});

export const authRateLimiter = rateLimit({
  windowMs: RATE_LIMIT.AUTH_WINDOW_MS,
  max: RATE_LIMIT.AUTH_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many authentication attempts, please try again later'),
  statusCode: HTTP_STATUS.TOO_MANY_REQUESTS,
});
