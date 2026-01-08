import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const slidesRoutes: FastifyPluginAsync = async (fastify) => {
  // Update slide
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as any;

    const slide = await prisma.slide.update({
      where: { id },
      data: updates,
      include: { elements: true },
    });

    return { success: true, data: slide };
  });

  // Update element
  fastify.patch('/:slideId/elements/:elementId', async (request, reply) => {
    const { elementId } = request.params as { slideId: string; elementId: string };
    const updates = request.body as any;

    const element = await prisma.element.update({
      where: { id: elementId },
      data: updates,
    });

    return { success: true, data: element };
  });
};
