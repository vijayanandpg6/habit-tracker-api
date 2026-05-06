import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { asyncHandler } from '../utils/asyncHandler';

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.signup(req.body);
  return sendCreated(res, 'Account created. Please check your email to verify your account.', result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  return sendSuccess(res, 'Login successful', result);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyEmail(req.body.token as string);
  return sendSuccess(res, 'Email verified successfully', result);
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.getUserById(req.user!.userId);
  return sendSuccess(res, 'User retrieved', result);
});
