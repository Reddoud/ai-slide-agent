import { FastifyPluginAsync } from 'fastify';
import { addJob } from '../utils/queue';

export const exportRoutes: FastifyPluginAsync = async (fastify) => {
  // Export deck to PPTX
  fastify.post('/:deckId/pptx', async (request, reply) => {
    const { deckId } = request.params as { deckId: string };

    const job = await addJob('render_pptx', { deckId });

    return {
      success: true,
      data: {
        jobId: job.id,
        message: 'Export started',
      },
    };
  });
};
