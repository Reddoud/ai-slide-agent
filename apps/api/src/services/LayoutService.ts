import { PrismaClient } from '@prisma/client';
import { LayoutEngine } from '@slide-agent/layout-engine';
import { DeckPlan, SlideType } from '@slide-agent/shared';
import { logger } from '../utils/logger';
import { nanoid } from 'nanoid';

const prisma = new PrismaClient();

export class LayoutService {
  private layoutEngine: LayoutEngine;

  constructor() {
    this.layoutEngine = new LayoutEngine();
  }

  async layoutDeck(deckId: string): Promise<void> {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
    });

    if (!deck || !deck.planData) {
      throw new Error(`Deck ${deckId} not found or has no plan`);
    }

    logger.info({ deckId }, 'Laying out deck');

    const plan = deck.planData as any as DeckPlan;

    // Delete existing slides
    await prisma.slide.deleteMany({ where: { deckId } });

    // Create slides from plan
    for (let i = 0; i < plan.outline.length; i++) {
      const slideInfo = plan.outline[i];

      const layoutOutput = this.layoutEngine.layoutSlide({
        slideType: slideInfo.type as SlideType,
        title: slideInfo.title,
        content: [
          {
            type: 'bullets',
            data: slideInfo.keyPoints,
          },
        ],
      });

      // Create slide
      const slide = await prisma.slide.create({
        data: {
          deckId,
          type: slideInfo.type,
          order: i,
          title: slideInfo.title,
          notes: slideInfo.notes,
          layoutData: layoutOutput as any,
        },
      });

      // Create elements
      for (const elem of layoutOutput.elements) {
        await prisma.element.create({
          data: {
            slideId: slide.id,
            type: elem.type,
            position: elem.position,
            content: elem.content,
            style: elem.style || {},
            metadata: elem.metadata || {},
          },
        });
      }

      logger.debug({ slideId: slide.id, order: i }, 'Created slide');
    }

    // Update deck status
    await prisma.deck.update({
      where: { id: deckId },
      data: { status: 'REVIEW' },
    });

    logger.info({ deckId }, 'Deck layout completed');
  }
}

export const layoutService = new LayoutService();
