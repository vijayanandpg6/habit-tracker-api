import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthTokenPayload } from '../types/api.types';

export const signToken = (payload: AuthTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);

export const verifyToken = (token: string): AuthTokenPayload => {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  return decoded as AuthTokenPayload;
};
