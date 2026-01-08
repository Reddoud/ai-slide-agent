import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { CreateDeckInputSchema } from '@slide-agent/shared';
import { addJob } from '../utils/queue';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export const decksRoutes: FastifyPluginAsync = async (fastify) => {
  // List decks
  fastify.get('/', async (request, reply) => {
    // TODO: Add auth and filter by organization
    const decks = await prisma.deck.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        _count: {
          select: { slides: true },
        },
      },
    });

    return { success: true, data: decks };
  });

  // Get deck by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        slides: {
          include: {
            elements: true,
          },
          orderBy: { order: 'asc' },
        },
        theme: true,
      },
    });

    if (!deck) {
      return reply.status(404).send({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Deck not found' },
      });
    }

    return { success: true, data: deck };
  });

  // Create deck
  fastify.post('/', async (request, reply) => {
    const input = CreateDeckInputSchema.parse(request.body);

    // TODO: Get user from auth
    const userId = 'demo-user-id';
    const orgId = 'demo-org-id';

    // Create user and org if they don't exist (demo mode)
    let user = await prisma.user.findFirst();
    if (!user) {
      let org = await prisma.organization.findFirst();
      if (!org) {
        org = await prisma.organization.create({
          data: { name: 'Demo Org', slug: 'demo' },
        });
      }
      user = await prisma.user.create({
        data: {
          email: 'demo@example.com',
          name: 'Demo User',
          organizationId: org.id,
        },
      });
    }

    const deck = await prisma.deck.create({
      data: {
        title: input.title,
        audience: input.audience,
        goal: input.goal,
        targetSlides: input.targetSlides,
        themeId: input.themeId,
        organizationId: user.organizationId,
        createdById: user.id,
        status: 'PLANNING',
        metadata: {
          startMode: input.startMode,
          inputContent: input.inputContent,
        },
      },
    });

    // Enqueue planning job
    await addJob('plan_deck', { deckId: deck.id });

    return reply.status(201).send({ success: true, data: deck });
  });

  // Update deck
  fastify.patch('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const updates = request.body as any;

    const deck = await prisma.deck.update({
      where: { id },
      data: updates,
    });

    return { success: true, data: deck };
  });

  // Delete deck
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    await prisma.deck.delete({ where: { id } });

    return { success: true, data: { id } };
  });
};
