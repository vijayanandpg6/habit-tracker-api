import crypto from 'crypto';

export const generateSecureToken = (bytes = 32): string =>
  crypto.randomBytes(bytes).toString('hex');

export const hashToken = (token: string): string =>
  crypto.createHash('sha256').update(token).digest('hex');
