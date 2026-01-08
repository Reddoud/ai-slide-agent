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
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'worker/index.ts:16',message:'Worker job received',data:{jobId:job.id,jobType:job.name,jobData:job.data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    logger.info({ jobId: job.id, jobType: job.name }, 'Processing job');

    switch (job.name) {
      case 'plan_deck':
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'worker/index.ts:22',message:'Routing to plan_deck processor',data:{jobId:job.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
        return await planDeckProcessor(job);
      case 'layout_deck':
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'worker/index.ts:26',message:'Routing to layout_deck processor',data:{jobId:job.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
        // #endregion
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
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'worker/index.ts:40',message:'Job completed event',data:{jobId:job.id,jobType:job.name},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  logger.info({ jobId: job.id, jobType: job.name }, 'Job completed');
});

worker.on('failed', (job, err) => {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'worker/index.ts:45',message:'Job failed event',data:{jobId:job?.id,jobType:job?.name,error:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion
  logger.error({ jobId: job?.id, jobType: job?.name, error: err }, 'Job failed');
});

logger.info('Worker started');

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker');
  await worker.close();
  process.exit(0);
});
