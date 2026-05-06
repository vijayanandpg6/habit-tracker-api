import { VERIFICATION_TOKEN_EXPIRY_HOURS } from '../constants';
import { userRepository } from '../repositories/user.repository';
import { generateSecureToken } from '../utils/crypto';
import { signToken } from '../utils/jwt';
import {
  ConflictError,
  UnauthorizedError,
  BadRequestError,
  NotFoundError,
} from '../utils/appError';
import { emailService } from './email.service';

export interface SignupDto {
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export const authService = {
  signup: async ({ email, password }: SignupDto) => {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new ConflictError('Email already registered');

    const verificationToken = generateSecureToken();
    const verificationTokenExpiresAt = new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    );

    const user = await userRepository.create({
      email,
      password,
      verificationToken,
      verificationTokenExpiresAt,
    });

    await emailService.sendVerificationEmail(email, verificationToken);

    return { id: user._id, email: user.email };
  },

  login: async ({ email, password }: LoginDto) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new UnauthorizedError('Invalid credentials');

    if (!user.isEmailVerified) {
      throw new UnauthorizedError('Please verify your email before logging in');
    }

    const token = signToken({ userId: String(user._id), email: user.email });

    return { token, user: { id: user._id, email: user.email } };
  },

  verifyEmail: async (token: string) => {
    const user = await userRepository.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) throw new BadRequestError('Invalid or expired verification token');

    if (user.isEmailVerified) throw new BadRequestError('Email already verified');

    await userRepository.markVerified(String(user._id));

    return { email: user.email };
  },

  getUserById: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new NotFoundError('User');
    return { id: user._id, email: user.email, isEmailVerified: user.isEmailVerified };
  },
};
