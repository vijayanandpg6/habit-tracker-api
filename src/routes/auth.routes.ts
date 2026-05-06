import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { signupValidator, loginValidator, verifyEmailValidator } from '../validators/auth.validator';
import { validate } from '../middlewares/validate.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { authRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/signup', authRateLimiter, signupValidator, validate, authController.signup);
router.post('/login', authRateLimiter, loginValidator, validate, authController.login);
router.post('/verify-email', verifyEmailValidator, validate, authController.verifyEmail);
router.get('/me', authenticate, authController.getMe);

export default router;
