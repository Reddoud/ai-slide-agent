import { Job } from 'bullmq';
import { logger } from '../utils/logger';

export async function layoutDeckProcessor(job: Job) {
  const { deckId } = job.data;

  logger.info({ jobId: job.id, deckId }, 'Processing layout_deck job');

  try {
    await job.updateProgress(50);

    // Layout logic would go here

    await job.updateProgress(100);

    return { success: true, deckId };
  } catch (error) {
    logger.error({ error, jobId: job.id }, 'Layout failed');
    throw error;
  }
}
