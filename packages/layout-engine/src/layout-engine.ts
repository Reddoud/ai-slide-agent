import { SlideType, Element, Position } from '@slide-agent/shared';
import { Grid, GridCell, SLIDE_WIDTH, SLIDE_HEIGHT } from './grid';
import { getTemplate, SlideTemplate } from './templates';
import { calculateOptimalFontSize, breakLongTitle } from './rules/typography';
import { calculateBulletSpacing } from './rules/spacing';
import { willContentOverflow, adjustForOverflow } from './rules/overflow';

export interface LayoutInput {
  slideType: SlideType;
  title: string;
  subtitle?: string;
  content: Array<{
    type: string;
    data: any;
  }>;
}

export interface LayoutOutput {
  elements: Array<{
    type: string;
    position: Position;
    content: any;
    style?: any;
    metadata?: any;
  }>;
  warnings: string[];
}

export class LayoutEngine {
  private grid: Grid;

  constructor() {
    this.grid = new Grid();
  }

  layoutSlide(input: LayoutInput): LayoutOutput {
    const template = getTemplate(input.slideType);
    const elements: LayoutOutput['elements'] = [];
    const warnings: string[] = [];

    // Layout title
    const titleRegion = template.regions.find(r => r.name === 'title');
    if (titleRegion) {
      const titlePosition = this.grid.cellToPosition(titleRegion.cell);
      const titleLines = breakLongTitle(input.title);

      if (titleLines.length > 2) {
        warnings.push('Title is too long and may be truncated');
      }

      elements.push({
        type: 'title',
        position: titlePosition,
        content: titleLines.join('\n'),
        style: {
          fontSize: 36,
          bold: true,
          color: '#000000',
          align: 'left',
        },
      });
    }

    // Layout subtitle if present
    if (input.subtitle) {
      const subtitleRegion = template.regions.find(r => r.name === 'subtitle');
      if (subtitleRegion) {
        const subtitlePosition = this.grid.cellToPosition(subtitleRegion.cell);
        elements.push({
          type: 'text',
          position: subtitlePosition,
          content: input.subtitle,
          style: {
            fontSize: 24,
            color: '#666666',
            align: 'left',
          },
        });
      }
    }

    // Layout content regions
    let contentIndex = 0;
    for (const region of template.regions) {
      if (region.name === 'title' || region.name === 'subtitle' || region.name === 'author') {
        continue;
      }

      if (contentIndex >= input.content.length) {
        if (!region.optional) {
          warnings.push(`Missing content for region: ${region.name}`);
        }
        continue;
      }

      const contentItem = input.content[contentIndex];
      const position = this.grid.cellToPosition(region.cell);

      // Layout based on content type
      if (contentItem.type === 'bullets' && region.elementType === 'bullet_list') {
        const bullets = contentItem.data as string[];

        // Check for overflow
        const overflowCheck = adjustForOverflow({
          content: bullets,
          fontSize: 18,
          maxWidth: position.width,
          maxHeight: position.height,
        });

        if (overflowCheck.truncated) {
          warnings.push(`Content in region ${region.name} may be truncated`);
        }

        elements.push({
          type: 'bullet_list',
          position,
          content: bullets,
          style: {
            fontSize: overflowCheck.adjustedFontSize,
            bulletSpacing: calculateBulletSpacing(bullets.length),
            color: '#333333',
          },
        });
      } else if (contentItem.type === 'text') {
        const fontSize = calculateOptimalFontSize(
          contentItem.data,
          position.width,
          position.height,
          24,
          14
        );

        elements.push({
          type: 'text',
          position,
          content: contentItem.data,
          style: {
            fontSize,
            color: '#333333',
            align: 'left',
          },
        });
      } else if (contentItem.type === 'chart') {
        elements.push({
          type: 'chart',
          position,
          content: contentItem.data,
          metadata: {
            chartType: contentItem.data.type || 'bar',
          },
        });
      } else if (contentItem.type === 'diagram') {
        elements.push({
          type: 'diagram',
          position,
          content: contentItem.data,
        });
      }

      contentIndex++;
    }

    return { elements, warnings };
  }

  // Helper to create a simple content slide
  createContentSlide(title: string, bullets: string[]): LayoutOutput {
    return this.layoutSlide({
      slideType: 'content',
      title,
      content: [{ type: 'bullets', data: bullets }],
    });
  }

  // Helper to create a two-column slide
  createTwoColumnSlide(title: string, leftBullets: string[], rightBullets: string[]): LayoutOutput {
    return this.layoutSlide({
      slideType: 'two_column',
      title,
      content: [
        { type: 'bullets', data: leftBullets },
        { type: 'bullets', data: rightBullets },
      ],
    });
  }
}
