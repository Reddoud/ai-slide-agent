import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { config } from '../config';
import { logger } from './logger';

const connection = new Redis(config.redis.url, {
  maxRetriesPerRequest: null,
});

export const deckQueue = new Queue('deck-processing', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    removeOnComplete: 100,
    removeOnFail: 200,
  },
});

export const addJob = async (type: string, data: any) => {
  const job = await deckQueue.add(type, data);
  logger.info({ jobId: job.id, type }, 'Added job to queue');
  return job;
};

// Helper to get job status
export const getJobStatus = async (jobId: string) => {
  const job = await deckQueue.getJob(jobId);
  if (!job) return null;

  return {
    id: job.id,
    name: job.name,
    progress: await job.getState(),
    data: job.data,
    returnvalue: job.returnvalue,
    failedReason: job.failedReason,
  };
};
