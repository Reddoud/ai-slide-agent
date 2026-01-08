import { QualityIssue } from '@slide-agent/shared';

export interface SlideForNarrative {
  id: string;
  title: string;
  order: number;
  type: string;
  elements: Array<{ type: string; content: any }>;
}

export const checkNarrativeCoherence = (slides: SlideForNarrative[]): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  if (slides.length < 2) return issues;

  // Check for missing title slide
  const hasTitleSlide = slides.some(s => s.type === 'title');
  if (!hasTitleSlide) {
    issues.push({
      id: 'narrative-no-title',
      slideId: slides[0].id,
      severity: 'warning',
      category: 'narrative',
      message: 'Deck is missing a title slide',
      suggestion: 'Add a title slide at the beginning',
    });
  }

  // Check for missing agenda (recommended for decks > 10 slides)
  if (slides.length > 10) {
    const hasAgenda = slides.some(s => s.type === 'agenda');
    if (!hasAgenda) {
      issues.push({
        id: 'narrative-no-agenda',
        slideId: slides[1]?.id || slides[0].id,
        severity: 'info',
        category: 'narrative',
        message: 'Consider adding an agenda slide for longer presentations',
        suggestion: 'Insert an agenda slide after the title',
      });
    }
  }

  // Check that each slide has a clear takeaway (title should be informative)
  slides.forEach(slide => {
    if (slide.type === 'title' || slide.type === 'agenda') return;

    // Generic titles are a red flag
    const genericTitles = ['overview', 'background', 'details', 'information', 'slide'];
    if (genericTitles.some(generic => slide.title.toLowerCase().includes(generic))) {
      issues.push({
        id: `narrative-${slide.id}-generic-title`,
        slideId: slide.id,
        severity: 'info',
        category: 'narrative',
        message: `Slide title "${slide.title}" is too generic`,
        suggestion: 'Make title more specific and insight-driven',
      });
    }

    // Very short titles may lack context
    if (slide.title.split(' ').length <= 2) {
      issues.push({
        id: `narrative-${slide.id}-short-title`,
        slideId: slide.id,
        severity: 'info',
        category: 'narrative',
        message: 'Slide title may be too brief',
        suggestion: 'Consider adding more context to the title',
      });
    }
  });

  return issues;
};

export const checkAgendaAlignment = (params: {
  agendaItems: string[];
  slides: SlideForNarrative[];
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  if (params.agendaItems.length === 0) return issues;

  // Check if section dividers match agenda
  const sectionDividers = params.slides.filter(s => s.type === 'section_divider');

  if (sectionDividers.length !== params.agendaItems.length) {
    issues.push({
      id: 'narrative-agenda-mismatch-count',
      slideId: params.slides[0].id,
      severity: 'warning',
      category: 'narrative',
      message: `Agenda has ${params.agendaItems.length} items but only ${sectionDividers.length} section dividers`,
      suggestion: 'Ensure each agenda item has a corresponding section divider',
    });
  }

  return issues;
};

export const checkSlideFlow = (slides: SlideForNarrative[]): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  // Check for logical progression
  for (let i = 0; i < slides.length - 1; i++) {
    const current = slides[i];
    const next = slides[i + 1];

    // Don't put appendix slides in the middle
    if (current.type === 'appendix' && i < slides.length - 3) {
      issues.push({
        id: `narrative-${current.id}-appendix-placement`,
        slideId: current.id,
        severity: 'warning',
        category: 'narrative',
        message: 'Appendix slide appears in the middle of the deck',
        suggestion: 'Move appendix slides to the end',
      });
    }

    // Title slide should be first
    if (next.type === 'title' && i > 0) {
      issues.push({
        id: `narrative-${next.id}-title-placement`,
        slideId: next.id,
        severity: 'error',
        category: 'narrative',
        message: 'Title slide should be at the beginning',
        suggestion: 'Move title slide to the start of the deck',
      });
    }
  }

  return issues;
};
