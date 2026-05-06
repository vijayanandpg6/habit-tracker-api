import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { createApp } from './app';
import { logger } from './lib/logger';

const bootstrap = async () => {
  const app = createApp();

  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running`, { port: env.PORT, env: env.NODE_ENV });
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('Server closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled rejection', { reason });
    process.exit(1);
  });

  process.on('uncaughtException', (err) => {
    logger.error('Uncaught exception', { message: err.message, stack: err.stack });
    process.exit(1);
  });
};

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err);
  process.exit(1);
});
