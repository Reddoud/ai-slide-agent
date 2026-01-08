import { Worker } from 'bullmq';
import { Redis } from 'ioredis';
import { config } from './config';
import { logger } from './utils/logger';
import { planDeckProcessor } from './processors/plan-deck';
import { layoutDeckProcessor } from './processors/layout-deck';
import { renderPPTXProcessor } from './processors/render-pptx';

const connection = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  'deck-processing',
  async (job) => {
    logger.info({ jobId: job.id, jobType: job.name }, 'Processing job');

    switch (job.name) {
      case 'plan_deck':
        return await planDeckProcessor(job);
      case 'layout_deck':
        return await layoutDeckProcessor(job);
      case 'render_pptx':
        return await renderPPTXProcessor(job);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  },
  {
    connection,
    concurrency: config.concurrency,
  }
);

worker.on('completed', (job) => {
  logger.info({ jobId: job.id, jobType: job.name }, 'Job completed');
});

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, jobType: job?.name, error: err }, 'Job failed');
});

logger.info('Worker started');

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker');
  await worker.close();
  process.exit(0);
});
