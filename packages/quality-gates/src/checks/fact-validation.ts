import { QualityIssue } from '@slide-agent/shared';

export interface FactClaim {
  text: string;
  type: 'statistic' | 'market_data' | 'attribution' | 'trend' | 'date';
  needsSource: boolean;
}

export const extractFactClaims = (text: string): FactClaim[] => {
  const claims: FactClaim[] = [];

  // Pattern: percentages and statistics
  const percentagePattern = /(\d+(?:\.\d+)?%)/g;
  const percentages = text.match(percentagePattern);
  if (percentages) {
    percentages.forEach(stat => {
      claims.push({
        text: stat,
        type: 'statistic',
        needsSource: true,
      });
    });
  }

  // Pattern: large numbers (likely market size, revenue, etc.)
  const largeNumberPattern = /\$\d{1,3}(?:,\d{3})+(?:\.\d+)?[BMK]?|\d{1,3}(?:,\d{3})+\s*(?:million|billion|trillion)/gi;
  const largeNumbers = text.match(largeNumberPattern);
  if (largeNumbers) {
    largeNumbers.forEach(num => {
      claims.push({
        text: num,
        type: 'market_data',
        needsSource: true,
      });
    });
  }

  // Pattern: attributions (according to, per, cited by)
  const attributionPattern = /(?:according to|per|cited by|source:|via)\s+([A-Z][a-zA-Z\s&]+)/g;
  const attributions = text.match(attributionPattern);
  if (attributions) {
    attributions.forEach(attr => {
      claims.push({
        text: attr,
        type: 'attribution',
        needsSource: false, // Already has attribution
      });
    });
  }

  // Pattern: growth/trend claims
  const trendPattern = /(?:grow|increase|decrease|decline|rise|fall)(?:s|ed|ing)?\s+(?:by\s+)?\d+/gi;
  const trends = text.match(trendPattern);
  if (trends) {
    trends.forEach(trend => {
      claims.push({
        text: trend,
        type: 'trend',
        needsSource: true,
      });
    });
  }

  // Pattern: specific years or dates (may need verification)
  const yearPattern = /\b(19\d{2}|20\d{2})\b/g;
  const years = text.match(yearPattern);
  if (years) {
    years.forEach(year => {
      claims.push({
        text: year,
        type: 'date',
        needsSource: false,
      });
    });
  }

  return claims;
};

export const checkFactValidation = (params: {
  slideId: string;
  elementId: string;
  text: string;
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];
  const claims = extractFactClaims(params.text);

  const claimsNeedingSource = claims.filter(c => c.needsSource);

  if (claimsNeedingSource.length > 0) {
    issues.push({
      id: `fact-${params.elementId}-needs-source`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'info',
      category: 'fact',
      message: `Found ${claimsNeedingSource.length} claim(s) that should be sourced: ${claimsNeedingSource.map(c => c.text).join(', ')}`,
      suggestion: 'Add source attribution or verify accuracy',
    });
  }

  // Check for vague quantifiers that should be specific
  const vagueQuantifiers = ['many', 'most', 'few', 'several', 'some', 'numerous'];
  const hasVagueQuantifiers = vagueQuantifiers.some(q =>
    new RegExp(`\\b${q}\\b`, 'i').test(params.text)
  );

  if (hasVagueQuantifiers) {
    issues.push({
      id: `fact-${params.elementId}-vague-quantifiers`,
      slideId: params.slideId,
      elementId: params.elementId,
      severity: 'info',
      category: 'fact',
      message: 'Consider replacing vague quantifiers with specific numbers',
      suggestion: 'Use precise data when available',
    });
  }

  return issues;
};

export const checkSourceConsistency = (params: {
  deckId: string;
  sources: Array<{ slideId: string; source: string }>;
}): QualityIssue[] => {
  const issues: QualityIssue[] = [];

  // Check for inconsistent source formatting
  const sourceFormats = new Set<string>();

  params.sources.forEach(s => {
    if (s.source.startsWith('http')) {
      sourceFormats.add('url');
    } else if (/\d{4}/.test(s.source)) {
      sourceFormats.add('citation');
    } else {
      sourceFormats.add('text');
    }
  });

  if (sourceFormats.size > 1) {
    issues.push({
      id: `fact-${params.deckId}-inconsistent-sources`,
      slideId: params.sources[0].slideId,
      severity: 'info',
      category: 'fact',
      message: 'Inconsistent source formatting across deck',
      suggestion: 'Use consistent citation style throughout',
    });
  }

  return issues;
};
