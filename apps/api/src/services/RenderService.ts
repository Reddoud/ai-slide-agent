import { PrismaClient } from '@prisma/client';
import { PPTXRenderer } from '@slide-agent/pptx-renderer';
import { storageService } from '../utils/storage';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

export class RenderService {
  private renderer: PPTXRenderer;

  constructor() {
    this.renderer = new PPTXRenderer();
  }

  async renderDeckToPPTX(deckId: string): Promise<{ url: string; key: string }> {
    const deck = await prisma.deck.findUnique({
      where: { id: deckId },
      include: {
        slides: {
          include: {
            elements: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        theme: true,
      },
    });

    if (!deck) {
      throw new Error(`Deck ${deckId} not found`);
    }

    logger.info({ deckId }, 'Rendering deck to PPTX');

    // Convert to render format
    const renderInput = {
      title: deck.title,
      slides: deck.slides.map(slide => ({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle || undefined,
        notes: slide.notes || undefined,
        elements: slide.elements.map(elem => ({
          id: elem.id,
          type: elem.type,
          position: elem.position as any,
          content: elem.content,
          style: elem.style as any,
          locked: elem.locked,
        })),
      })),
      theme: deck.theme || undefined,
    };

    // Check layout integrity
    const warnings = this.renderer.checkLayoutIntegrity(renderInput);
    if (warnings.length > 0) {
      logger.warn({ warnings }, 'Layout integrity warnings');
    }

    // Render PPTX
    const buffer = await this.renderer.renderDeck(renderInput);

    // Upload to storage
    const filename = `${deck.title.replace(/[^a-z0-9]/gi, '_')}.pptx`;
    const { key, url } = await storageService.uploadFile(
      buffer,
      filename,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    );

    // Save as asset
    await prisma.asset.create({
      data: {
        deckId,
        filename,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        size: buffer.length,
        storageKey: key,
        url,
      },
    });

    logger.info({ deckId, key }, 'PPTX rendered and uploaded');

    return { url, key };
  }
}

export const renderService = new RenderService();
