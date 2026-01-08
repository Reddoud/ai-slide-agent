// Overflow prevention and content fitting

export interface ContentDimensions {
  estimatedWidth: number;
  estimatedHeight: number;
  lineCount: number;
}

export const estimateTextDimensions = (
  text: string,
  fontSize: number,
  maxWidth: number
): ContentDimensions => {
  // Rough estimation: average char width is ~0.6 * fontSize
  const avgCharWidth = fontSize * 0.6;
  const charsPerLine = Math.floor(maxWidth / avgCharWidth);
  const lineCount = Math.ceil(text.length / charsPerLine);
  const lineHeight = fontSize * 1.4;

  return {
    estimatedWidth: Math.min(text.length * avgCharWidth, maxWidth),
    estimatedHeight: lineCount * lineHeight,
    lineCount,
  };
};

export const estimateBulletListHeight = (
  bullets: string[],
  fontSize: number,
  maxWidth: number
): number => {
  const bulletSpacing = 16;
  let totalHeight = 0;

  for (const bullet of bullets) {
    const dims = estimateTextDimensions(bullet, fontSize, maxWidth - 40); // Account for bullet indent
    totalHeight += dims.estimatedHeight + bulletSpacing;
  }

  return totalHeight;
};

export const willContentOverflow = (
  contentHeight: number,
  containerHeight: number,
  padding: number = 20
): boolean => {
  return contentHeight > containerHeight - padding * 2;
};

export const adjustForOverflow = (params: {
  content: string[];
  fontSize: number;
  maxWidth: number;
  maxHeight: number;
}): {
  adjustedFontSize: number;
  truncated: boolean;
  fitsCompletely: boolean;
} => {
  let fontSize = params.fontSize;
  let estimatedHeight = estimateBulletListHeight(params.content, fontSize, params.maxWidth);

  // Try reducing font size first
  while (estimatedHeight > params.maxHeight && fontSize > 14) {
    fontSize -= 1;
    estimatedHeight = estimateBulletListHeight(params.content, fontSize, params.maxWidth);
  }

  const fitsCompletely = estimatedHeight <= params.maxHeight;
  const truncated = !fitsCompletely && fontSize <= 14;

  return {
    adjustedFontSize: fontSize,
    truncated,
    fitsCompletely,
  };
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
};

// Compress bullet points if they're too long
export const compressBullets = (bullets: string[], maxWordsPerBullet: number = 15): string[] => {
  return bullets.map(bullet => {
    const words = bullet.split(' ');
    if (words.length <= maxWordsPerBullet) return bullet;
    return words.slice(0, maxWordsPerBullet).join(' ') + '...';
  });
};
