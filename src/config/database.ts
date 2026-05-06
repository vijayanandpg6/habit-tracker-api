import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../lib/logger';

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { error: err.message });
  });

  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  logger.info('MongoDB connected', { uri: env.MONGODB_URI.split('@').pop() });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  logger.info('MongoDB disconnected gracefully');
}
