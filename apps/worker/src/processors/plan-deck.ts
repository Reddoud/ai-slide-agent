import { Job } from 'bullmq';
import { logger } from '../utils/logger';
import { planningService } from '../services/PlanningService';
import { addJob } from '../utils/queue';

export async function planDeckProcessor(job: Job) {
  const { deckId } = job.data;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'plan-deck.ts:8',message:'planDeckProcessor entry',data:{jobId:job.id,deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  logger.info({ jobId: job.id, deckId }, 'Processing plan_deck job');

  try {
    await job.updateProgress(10);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'plan-deck.ts:16',message:'Calling PlanningService.planDeck',data:{deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Call PlanningService to generate plan
    const plan = await planningService.planDeck(deckId);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'plan-deck.ts:21',message:'PlanningService completed',data:{deckId,planOutlineLength:plan.outline.length},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Enqueue layout job
    await addJob('layout_deck', { deckId });

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'plan-deck.ts:26',message:'Enqueued layout_deck job',data:{deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    await job.updateProgress(100);

    logger.info({ jobId: job.id, deckId }, 'Deck planning completed');

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'plan-deck.ts:34',message:'planDeckProcessor exit',data:{success:true,deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    return { success: true, deckId };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'plan-deck.ts:39',message:'planDeckProcessor error',data:{error:error instanceof Error?error.message:String(error),deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    logger.error({ error, jobId: job.id, deckId }, 'Deck planning failed');
    throw error;
  }
}
