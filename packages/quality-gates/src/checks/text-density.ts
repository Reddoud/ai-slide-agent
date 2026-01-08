import { QualityIssue } from '@slide-agent/shared';

export interface TextDensityCheckParams {
  slideId: string;
  elementId: string;
  text: string;
  area: number; // pixel area
}

const MAX_WORDS_PER_SLIDE = 50;
const MAX_WORDS_PER_BULLET = 15;
const MAX_CHARS_PER_LINE = 100;

export const checkTextDensity = (params: TextDensityCheckParams): QualityIssue[] => {
  const issues: QualityIssue[] = [];
  const wordCount = params.text.split(/\s+/).filter(w => w.length > 0).length;
  const lines = params.text.split('\n');

  // Check total word count
  if (wordCount > MAX_WORDS_PER_SLIDE) {
    issues.push({
      id: `text-density-${params.elementId}-words`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'warning',
      category: 'text_density',
      message: `Too much text: ${wordCount} words (recommended: ${MAX_WORDS_PER_SLIDE} max)`,
      suggestion: 'Compress content or split into multiple slides',
    });
  }

  // Check line length
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length > MAX_CHARS_PER_LINE) {
      issues.push({
        id: `text-density-${params.elementId}-line-${i}`,
        slideId: params.slideId,
        elementId: params.elementId,
        severity: 'info',
        category: 'text_density',
        message: `Line ${i + 1} is too long (${lines[i].length} characters)`,
        suggestion: 'Break into shorter lines or use bullets',
      });
    }
  }

  return issues;
};

export const checkBulletDensity = (params: {
  slideId: string;
  elementId: string;
  bullets: string[];
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  if (params.bullets.length > 7) {
    issues.push({
      id: `bullet-density-${params.elementId}-count`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'warning',
      category: 'text_density',
      message: `Too many bullets: ${params.bullets.length} (recommended: 5-7 max)`,
      suggestion: 'Consolidate points or split into multiple slides',
    });
  }

  params.bullets.forEach((bullet, index) => {
    const wordCount = bullet.split(/\s+/).length;
    if (wordCount > MAX_WORDS_PER_BULLET) {
      issues.push({
        id: `bullet-density-${params.elementId}-${index}`,
        slideId: params.slideId,
        elementId: params.elementId,
        severity: 'info',
        category: 'text_density',
        message: `Bullet ${index + 1} is too wordy: ${wordCount} words`,
        suggestion: 'Tighten to 10-15 words',
      });
    }
  });

  return issues;
};
