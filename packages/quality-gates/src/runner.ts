import { QualityIssue, QualityReport } from '@slide-agent/shared';
import { checkTextDensity, checkBulletDensity } from './checks/text-density';
import {
  checkCapitalizationConsistency,
  checkTenseConsistency,
  checkNumberFormatConsistency,
  checkRepeatedPoints,
} from './checks/consistency';
import {
  checkNarrativeCoherence,
  checkAgendaAlignment,
  checkSlideFlow,
  SlideForNarrative,
} from './checks/narrative';
import { checkChartReadability, checkDataQuality } from './checks/chart-readability';
import { checkFactValidation } from './checks/fact-validation';

export interface QualityCheckInput {
  deckId: string;
  slides: Array<{
    id: string;
    title: string;
    order: number;
    type: string;
    elements: Array<{
      id: string;
      type: string;
      content: any;
      position: { x: number; y: number; width: number; height: number };
    }>;
  }>;
  agendaItems?: string[];
}

export class QualityGateRunner {
  async runAllChecks(input: QualityCheckInput): Promise<QualityReport> {
    const allIssues: QualityIssue[] = [];
    const passedChecks: string[] = [];

    // Convert to narrative format
    const narrativeSlides: SlideForNarrative[] = input.slides.map(s => ({
      id: s.id,
      title: s.title,
      order: s.order,
      type: s.type,
      elements: s.elements,
    }));

    // Run narrative checks
    const narrativeIssues = this.runNarrativeChecks(narrativeSlides, input.agendaItems);
    allIssues.push(...narrativeIssues);
    if (narrativeIssues.length === 0) passedChecks.push('narrative_coherence');

    // Run per-slide checks
    for (const slide of input.slides) {
      const slideIssues = await this.runSlideChecks(slide);
      allIssues.push(...slideIssues);
    }

    // Calculate overall score
    const score = this.calculateQualityScore(allIssues, input.slides.length);

    return {
      deckId: input.deckId,
      score,
      issues: allIssues,
      passedChecks,
      timestamp: new Date(),
    };
  }

  private runNarrativeChecks(
    slides: SlideForNarrative[],
    agendaItems?: string[]
  ): QualityIssue[] {
    const issues: QualityIssue[] = [];

    issues.push(...checkNarrativeCoherence(slides));
    issues.push(...checkSlideFlow(slides));

    if (agendaItems && agendaItems.length > 0) {
      issues.push(...checkAgendaAlignment({ agendaItems, slides }));
    }

    return issues;
  }

  private async runSlideChecks(slide: {
    id: string;
    title: string;
    type: string;
    elements: Array<{
      id: string;
      type: string;
      content: any;
      position: { x: number; y: number; width: number; height: number };
    }>;
  }): Promise<QualityIssue[]> {
    const issues: QualityIssue[] = [];

    // Collect all text elements for consistency checks
    const textElements: Array<{ elementId: string; text: string }> = [];
    const bulletElements: Array<{ elementId: string; text: string }> = [];

    for (const element of slide.elements) {
      const area = element.position.width * element.position.height;

      // Text density checks
      if (element.type === 'text' || element.type === 'title') {
        const text = typeof element.content === 'string' ? element.content : '';
        issues.push(
          ...checkTextDensity({
            slideId: slide.id,
            elementId: element.id,
            text,
            area,
          })
        );
        textElements.push({ elementId: element.id, text });

        // Fact validation
        issues.push(...checkFactValidation({
          slideId: slide.id,
          elementId: element.id,
          text,
        }));
      }

      // Bullet checks
      if (element.type === 'bullet_list') {
        const bullets = Array.isArray(element.content) ? element.content : [];
        issues.push(
          ...checkBulletDensity({
            slideId: slide.id,
            elementId: element.id,
            bullets,
          })
        );

        bullets.forEach(bullet => {
          bulletElements.push({ elementId: element.id, text: bullet });
          textElements.push({ elementId: element.id, text: bullet });
        });
      }

      // Chart readability checks
      if (element.type === 'chart' && element.content) {
        issues.push(
          ...checkChartReadability({
            slideId: slide.id,
            elementId: element.id,
            chartData: element.content,
            chartWidth: element.position.width,
            chartHeight: element.position.height,
          })
        );

        // Check data quality for each dataset
        if (element.content.datasets) {
          element.content.datasets.forEach((dataset: any) => {
            if (dataset.data) {
              issues.push(
                ...checkDataQuality({
                  slideId: slide.id,
                  elementId: element.id,
                  values: dataset.data,
                })
              );
            }
          });
        }
      }
    }

    // Consistency checks across elements
    if (bulletElements.length > 1) {
      issues.push(...checkCapitalizationConsistency({ slideId: slide.id, bullets: bulletElements }));
      issues.push(...checkRepeatedPoints({ slideId: slide.id, bullets: bulletElements }));
    }

    if (textElements.length > 0) {
      issues.push(...checkTenseConsistency({ slideId: slide.id, texts: textElements }));
      issues.push(...checkNumberFormatConsistency({ slideId: slide.id, texts: textElements }));
    }

    return issues;
  }

  private calculateQualityScore(issues: QualityIssue[], slideCount: number): number {
    // Start with perfect score
    let score = 100;

    // Deduct points based on severity
    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;
    const infoCount = issues.filter(i => i.severity === 'info').length;

    score -= errorCount * 10;
    score -= warningCount * 5;
    score -= infoCount * 2;

    // Normalize by slide count (more slides = more opportunities for issues)
    const issuesPerSlide = issues.length / slideCount;
    if (issuesPerSlide > 3) {
      score -= (issuesPerSlide - 3) * 2;
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }
}
