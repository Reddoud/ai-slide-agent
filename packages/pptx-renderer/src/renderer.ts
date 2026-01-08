import PptxGenJS from 'pptxgenjs';
import { Theme, Slide, Element } from '@slide-agent/shared';
import { defaultFontManager } from './font-manager';
import { ChartRenderer } from './chart-renderer';
import { DiagramRenderer } from './diagram-renderer';

export interface RenderDeckInput {
  title: string;
  slides: Array<{
    id: string;
    title: string;
    subtitle?: string;
    notes?: string;
    elements: Array<{
      id: string;
      type: string;
      position: { x: number; y: number; width: number; height: number };
      content: any;
      style?: any;
      locked?: boolean;
    }>;
  }>;
  theme?: Theme;
}

export class PPTXRenderer {
  private pptx: PptxGenJS;
  private chartRenderer: ChartRenderer;
  private diagramRenderer: DiagramRenderer;

  constructor() {
    this.pptx = new PptxGenJS();
    this.chartRenderer = new ChartRenderer();
    this.diagramRenderer = new DiagramRenderer();

    // Set presentation properties
    this.pptx.author = 'AI Slide Agent';
    this.pptx.company = 'AI Slide Agent';
    this.pptx.subject = 'Generated Presentation';
    this.pptx.title = 'AI-Generated Deck';

    // Set layout to 16:9
    this.pptx.layout = 'LAYOUT_16x9';
  }

  async renderDeck(input: RenderDeckInput): Promise<Buffer> {
    // Apply theme if provided
    if (input.theme) {
      this.applyTheme(input.theme);
    }

    // Render each slide
    for (const slideData of input.slides) {
      this.renderSlide(slideData);
    }

    // Generate PPTX file as buffer
    const buffer = await this.pptx.write({ outputType: 'nodebuffer' });
    return buffer as Buffer;
  }

  private applyTheme(theme: Theme): void {
    // Define master slide with theme
    this.pptx.defineSlideMaster({
      title: 'CUSTOM_THEME',
      background: { color: theme.colors.background },
      objects: [
        // Logo if provided
        ...(theme.logoUrl
          ? [{
              image: {
                x: 9.0,
                y: 0.2,
                w: 1.0,
                h: 0.5,
                path: theme.logoUrl,
              },
            }]
          : []),
      ],
    });
  }

  private renderSlide(slideData: {
    id: string;
    title: string;
    subtitle?: string;
    notes?: string;
    elements: Array<{
      id: string;
      type: string;
      position: { x: number; y: number; width: number; height: number };
      content: any;
      style?: any;
    }>;
  }): void {
    const slide = this.pptx.addSlide();

    // Add presenter notes if present
    if (slideData.notes) {
      slide.addNotes(slideData.notes);
    }

    // Render each element
    for (const element of slideData.elements) {
      this.renderElement(slide, element);
    }
  }

  private renderElement(
    slide: any,
    element: {
      type: string;
      position: { x: number; y: number; width: number; height: number };
      content: any;
      style?: any;
    }
  ): void {
    // Convert pixels to inches (PowerPoint uses inches)
    const position = {
      x: this.pxToInches(element.position.x),
      y: this.pxToInches(element.position.y),
      w: this.pxToInches(element.position.width),
      h: this.pxToInches(element.position.height),
    };

    switch (element.type) {
      case 'title':
        this.renderTitle(slide, element.content, position, element.style);
        break;

      case 'text':
        this.renderText(slide, element.content, position, element.style);
        break;

      case 'bullet_list':
        this.renderBulletList(slide, element.content, position, element.style);
        break;

      case 'chart':
        this.chartRenderer.renderChart(slide, element.content, position);
        break;

      case 'diagram':
        this.diagramRenderer.renderDiagram(slide, element.content, position);
        break;

      case 'image':
        this.renderImage(slide, element.content, position);
        break;

      case 'table':
        this.renderTable(slide, element.content, position);
        break;
    }
  }

  private renderTitle(slide: any, text: string, position: any, style?: any): void {
    const font = style?.fontFamily ? defaultFontManager.getSafeFont(style.fontFamily) : 'Arial';

    slide.addText(text, {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      fontSize: style?.fontSize || 36,
      bold: style?.bold !== false,
      color: style?.color?.replace('#', '') || '000000',
      fontFace: font,
      align: style?.align || 'left',
    });
  }

  private renderText(slide: any, text: string, position: any, style?: any): void {
    const font = style?.fontFamily ? defaultFontManager.getSafeFont(style.fontFamily) : 'Arial';

    slide.addText(text, {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      fontSize: style?.fontSize || 18,
      color: style?.color?.replace('#', '') || '333333',
      fontFace: font,
      align: style?.align || 'left',
      bold: style?.bold || false,
      italic: style?.italic || false,
    });
  }

  private renderBulletList(slide: any, bullets: string[], position: any, style?: any): void {
    const font = style?.fontFamily ? defaultFontManager.getSafeFont(style.fontFamily) : 'Arial';

    slide.addText(
      bullets.map(bullet => ({ text: bullet, options: { bullet: true } })),
      {
        x: position.x,
        y: position.y,
        w: position.w,
        h: position.h,
        fontSize: style?.fontSize || 18,
        color: style?.color?.replace('#', '') || '333333',
        fontFace: font,
        lineSpacing: style?.bulletSpacing || 16,
      }
    );
  }

  private renderImage(slide: any, imageData: { url: string; alt?: string }, position: any): void {
    slide.addImage({
      path: imageData.url,
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
    });
  }

  private renderTable(slide: any, tableData: { headers: string[]; rows: string[][] }, position: any): void {
    const rows = [
      tableData.headers.map(h => ({ text: h, options: { bold: true, fill: 'E8F4F8' } })),
      ...tableData.rows,
    ];

    slide.addTable(rows, {
      x: position.x,
      y: position.y,
      w: position.w,
      h: position.h,
      fontSize: 12,
      border: { pt: 1, color: 'CCCCCC' },
    });
  }

  // Convert pixels to inches (PowerPoint uses inches, 96 DPI standard)
  private pxToInches(px: number): number {
    return px / 96;
  }

  // Check layout integrity
  checkLayoutIntegrity(input: RenderDeckInput): string[] {
    const warnings: string[] = [];

    for (const slide of input.slides) {
      for (const element of slide.elements) {
        // Check if elements are within bounds
        if (element.position.x < 0 || element.position.y < 0) {
          warnings.push(`Element ${element.id} in slide ${slide.id} has negative position`);
        }

        if (element.position.x + element.position.width > 1280) {
          warnings.push(`Element ${element.id} in slide ${slide.id} extends beyond right edge`);
        }

        if (element.position.y + element.position.height > 720) {
          warnings.push(`Element ${element.id} in slide ${slide.id} extends beyond bottom edge`);
        }

        // Check for overlapping critical elements
        // (This is a simplified check - full overlap detection would be more complex)
      }
    }

    return warnings;
  }
}
