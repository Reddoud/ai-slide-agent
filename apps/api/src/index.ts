import { buildServer } from './server';
import { config } from './config';
import { logger } from './utils/logger';

async function start() {
  try {
    const server = await buildServer();

    await server.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    logger.info(`Server listening on port ${config.port}`);
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
}

start();
