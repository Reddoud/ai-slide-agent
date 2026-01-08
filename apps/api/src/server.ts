import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { config } from './config';
import { logger } from './utils/logger';
import { storageService } from './utils/storage';

// Import routes
import { decksRoutes } from './routes/decks';
import { slidesRoutes } from './routes/slides';
import { exportRoutes } from './routes/export';
import { uploadRoutes } from './routes/upload';
import { templatesRoutes } from './routes/templates';

export async function buildServer() {
  const fastify = Fastify({
    logger: logger as any,
    requestIdLogLabel: 'reqId',
    disableRequestLogging: false,
    requestIdHeader: 'x-request-id',
  });

  // Register plugins
  await fastify.register(cors, {
    origin: true,
    credentials: true,
  });

  await fastify.register(multipart, {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  });

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Register routes
  await fastify.register(decksRoutes, { prefix: '/api/decks' });
  await fastify.register(slidesRoutes, { prefix: '/api/slides' });
  await fastify.register(exportRoutes, { prefix: '/api/export' });
  await fastify.register(uploadRoutes, { prefix: '/api/upload' });
  await fastify.register(templatesRoutes, { prefix: '/api/templates' });

  // Error handler
  fastify.setErrorHandler((error, request, reply) => {
    logger.error({ error, reqId: request.id }, 'Request error');

    reply.status(error.statusCode || 500).send({
      success: false,
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: error.message,
      },
    });
  });

  // Ensure MinIO bucket exists
  await storageService.ensureBucket();

  return fastify;
}
