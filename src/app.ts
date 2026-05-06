import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import { apiRouter, healthRoutes } from './routes';
import docsRouter from './routes/docs.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { globalRateLimiter } from './middlewares/rateLimiter.middleware';

export const createApp = () => {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
    }),
  );
  app.use(
    cors({
      origin: env.CLIENT_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }),
  );

  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(globalRateLimiter);

  app.use('/health', healthRoutes);
  app.use('/api/v1', apiRouter);
  app.use('/api-docs', docsRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};
