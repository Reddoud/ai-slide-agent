import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const templatesRoutes: FastifyPluginAsync = async (fastify) => {
  // List all themes/templates
  fastify.get('/', async (request, reply) => {
    const themes = await prisma.theme.findMany({
      where: {
        OR: [
          { isPublic: true },
          // TODO: Add organizationId filter from auth
        ],
      },
      orderBy: { name: 'asc' },
    });

    return { success: true, data: themes };
  });

  // Get theme by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const theme = await prisma.theme.findUnique({
      where: { id },
    });

    if (!theme) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Theme not found' },
      });
    }

    return { success: true, data: theme };
  });
};
