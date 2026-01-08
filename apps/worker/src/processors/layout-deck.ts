import { Job } from 'bullmq';
import { logger } from '../utils/logger';
import { layoutService } from '../services/LayoutService';

export async function layoutDeckProcessor(job: Job) {
  const { deckId } = job.data;

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout-deck.ts:6',message:'layoutDeckProcessor entry',data:{jobId:job.id,deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  logger.info({ jobId: job.id, deckId }, 'Processing layout_deck job');

  try {
    await job.updateProgress(10);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout-deck.ts:14',message:'Calling LayoutService.layoutDeck',data:{deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Call LayoutService to create slides
    await layoutService.layoutDeck(deckId);

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout-deck.ts:19',message:'LayoutService completed',data:{deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    await job.updateProgress(100);

    logger.info({ jobId: job.id, deckId }, 'Deck layout completed');

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout-deck.ts:26',message:'layoutDeckProcessor exit',data:{success:true,deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    return { success: true, deckId };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a40f3d54-ba36-48e3-810d-32d5d13467c6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'layout-deck.ts:31',message:'layoutDeckProcessor error',data:{error:error instanceof Error?error.message:String(error),deckId},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    logger.error({ error, jobId: job.id }, 'Layout failed');
    throw error;
  }
}
