import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { sendSuccess } from '../utils/response';

export const healthCheck = (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] ?? 'unknown';

  return sendSuccess(res, 'OK', {
    status: 'healthy',
    db: dbStatus,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
};
