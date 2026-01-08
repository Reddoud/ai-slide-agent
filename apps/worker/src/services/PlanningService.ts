import { PrismaClient } from '@prisma/client';
import { aiService } from './AIService';
import { DECK_PLANNING_PROMPT, DeckPlan } from '@slide-agent/shared';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class PlanningService {
  async planDeck(deckId: string): Promise<DeckPlan> {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
      include: { theme: true },
    });

    if (!deck) {
      throw new Error(`Deck ${deckId} not found`);
    }

    logger.info({ deckId }, 'Planning deck');

    // Get input content from metadata or use empty
    const inputContent = (deck.metadata as any)?.inputContent || '';

    const prompt = DECK_PLANNING_PROMPT({
      title: deck.title,
      audience: deck.audience,
      goal: deck.goal,
      targetSlides: deck.targetSlides,
      inputContent,
    });

    let plan: DeckPlan;

    if (aiService.isEnabled()) {
      const result = await aiService.generateStructured<DeckPlan>(prompt, null, inputContent);
      plan = result || this.getDefaultPlan(deck.title, deck.targetSlides);
    } else {
      plan = this.getDefaultPlan(deck.title, deck.targetSlides);
    }

    // Save plan to deck
    await prisma.deck.update({
      where: { id: deckId },
      data: {
        planData: plan as any,
        status: 'LAYOUT',
      },
    });

    logger.info({ deckId }, 'Deck planning completed');

    return plan;
  }

  private getDefaultPlan(title: string, targetSlides: number): DeckPlan {
    const outline = [
      {
        title: title,
        type: 'title',
        keyPoints: [],
        notes: 'Title slide',
      },
      {
        title: 'Agenda',
        type: 'agenda',
        keyPoints: ['Introduction', 'Main Points', 'Conclusion'],
        notes: 'Overview of presentation',
      },
    ];

    // Add content slides
    for (let i = 2; i < targetSlides - 1; i++) {
      outline.push({
        title: `Key Point ${i - 1}`,
        type: 'content',
        keyPoints: [
          'First main point',
          'Supporting detail',
          'Key takeaway',
        ],
        notes: `Slide ${i + 1} content`,
      });
    }

    // Add conclusion
    outline.push({
      title: 'Next Steps',
      type: 'content',
      keyPoints: [
        'Summary of key points',
        'Recommended actions',
        'Contact information',
      ],
      notes: 'Closing slide',
    });

    return {
      outline,
      narrative: 'A structured presentation covering the key topics',
      agenda: ['Introduction', 'Main Content', 'Conclusion'],
      talkTrack: 'This presentation provides an overview of the topic with clear next steps.',
    };
  }
}

export const planningService = new PlanningService();
