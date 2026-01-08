import { QualityIssue } from '@slide-agent/shared';

export const checkCapitalizationConsistency = (params: {
  slideId: string;
  bullets: Array<{ elementId: string; text: string }>;
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  if (params.bullets.length < 2) return issues;

  const patterns = params.bullets.map(b => ({
    elementId: b.elementId,
    text: b.text,
    startsWithCapital: /^[A-Z]/.test(b.text),
    startsWithLower: /^[a-z]/.test(b.text),
  }));

  const capitalCount = patterns.filter(p => p.startsWithCapital).length;
  const lowerCount = patterns.filter(p => p.startsWithLower).length;

  // If mix of capitalization styles
  if (capitalCount > 0 && lowerCount > 0) {
    issues.push({
      id: `consistency-${params.slideId}-capitalization`,
      slideId: params.slideId,
      severity: 'warning',
      category: 'consistency',
      message: 'Inconsistent capitalization in bullet points',
      suggestion: 'Use consistent capitalization (either all sentence case or all title case)',
    });
  }

  return issues;
};

export const checkTenseConsistency = (params: {
  slideId: string;
  texts: Array<{ elementId: string; text: string }>;
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  // Simple heuristic: check for mix of past/present tense verbs
  const pastTenseIndicators = ['was', 'were', 'had', 'did', 'went', 'came', 'saw', 'made', 'ed ', 'ed.', 'ed,'];
  const presentTenseIndicators = ['is', 'are', 'has', 'do', 'does', 'goes', 'comes', 'sees', 'makes'];

  let hasPast = false;
  let hasPresent = false;

  for (const item of params.texts) {
    const lowerText = item.text.toLowerCase();
    if (pastTenseIndicators.some(ind => lowerText.includes(ind))) {
      hasPast = true;
    }
    if (presentTenseIndicators.some(ind => lowerText.includes(ind))) {
      hasPresent = true;
    }
  }

  if (hasPast && hasPresent) {
    issues.push({
      id: `consistency-${params.slideId}-tense`,
      slideId: params.slideId,
      severity: 'info',
      category: 'consistency',
      message: 'Mixed tenses detected in slide',
      suggestion: 'Maintain consistent verb tense throughout the slide',
    });
  }

  return issues;
};

export const checkNumberFormatConsistency = (params: {
  slideId: string;
  texts: Array<{ elementId: string; text: string }>;
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  // Extract all numbers from text
  const numberPatterns: Array<{ elementId: string; numbers: string[] }> = params.texts.map(item => ({
    elementId: item.elementId,
    numbers: item.text.match(/\d{1,3}(?:,\d{3})*(?:\.\d+)?%?|\d+(?:\.\d+)?%?/g) || [],
  }));

  const allNumbers = numberPatterns.flatMap(p => p.numbers);

  if (allNumbers.length < 2) return issues;

  // Check for mix of comma-separated and non-comma-separated thousands
  const hasCommas = allNumbers.some(n => n.includes(','));
  const hasNoCommas = allNumbers.some(n => /\d{4,}/.test(n) && !n.includes(','));

  if (hasCommas && hasNoCommas) {
    issues.push({
      id: `consistency-${params.slideId}-numbers`,
      slideId: params.slideId,
      severity: 'info',
      category: 'consistency',
      message: 'Inconsistent number formatting (some with commas, some without)',
      suggestion: 'Use consistent number formatting throughout',
    });
  }

  return issues;
};

export const checkRepeatedPoints = (params: {
  slideId: string;
  bullets: Array<{ elementId: string; text: string }>;
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  for (let i = 0; i < params.bullets.length; i++) {
    for (let j = i + 1; j < params.bullets.length; j++) {
      const similarity = calculateTextSimilarity(
        params.bullets[i].text,
        params.bullets[j].text
      );

      if (similarity > 0.7) {
        issues.push({
          id: `consistency-${params.slideId}-repeated-${i}-${j}`,
          slideId: params.slideId,
          severity: 'warning',
          category: 'consistency',
          message: `Bullets ${i + 1} and ${j + 1} appear to be very similar or repeated`,
          suggestion: 'Remove duplicate or consolidate similar points',
        });
      }
    }
  }

  return issues;
};

// Simple text similarity using word overlap
function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = new Set(text1.toLowerCase().split(/\s+/));
  const words2 = new Set(text2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}
