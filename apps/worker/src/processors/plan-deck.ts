import { Job } from 'bullmq';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

// Import services from API (in production, these would be shared)
const prisma = new PrismaClient();

export async function planDeckProcessor(job: Job) {
  const { deckId } = job.data;

  logger.info({ jobId: job.id, deckId }, 'Processing plan_deck job');

  try {
    await job.updateProgress(10);

    // Import PlanningService logic here or call API
    // For simplicity, updating status
    await prisma.deck.update({
      where: { id: deckId },
      data: { status: 'LAYOUT' },
    });

    await job.updateProgress(100);

    logger.info({ jobId: job.id, deckId }, 'Deck planning completed');

    return { success: true, deckId };
  } catch (error) {
    logger.error({ error, jobId: job.id, deckId }, 'Deck planning failed');
    throw error;
  }
}
