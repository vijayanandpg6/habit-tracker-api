import dotenv from 'dotenv';

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
};

const optional = (key: string, fallback: string): string =>
  process.env[key] ?? fallback;

export const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: parseInt(optional('PORT', '3000'), 10),

  MONGODB_URI: required('MONGODB_URI'),

  JWT_SECRET: required('JWT_SECRET'),
  JWT_EXPIRES_IN: optional('JWT_EXPIRES_IN', '7d'),

  SMTP_HOST: required('SMTP_HOST'),
  SMTP_PORT: parseInt(optional('SMTP_PORT', '587'), 10),
  SMTP_USER: required('SMTP_USER'),
  SMTP_PASS: required('SMTP_PASS'),
  SMTP_FROM: optional('SMTP_FROM', 'noreply@habittracker.app'),

  CLIENT_URL: optional('CLIENT_URL', 'http://localhost:8081'),

  get isProduction() {
    return this.NODE_ENV === 'production';
  },
} as const;
