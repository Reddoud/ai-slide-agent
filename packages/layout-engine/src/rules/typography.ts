import { Typography } from '@slide-agent/shared';

export const DEFAULT_TYPOGRAPHY: Typography = {
  headingFont: 'Arial',
  bodyFont: 'Arial',
  h1Size: 44,
  h2Size: 32,
  h3Size: 24,
  bodySize: 18,
};

export interface TypographyScale {
  title: number;
  subtitle: number;
  heading: number;
  body: number;
  caption: number;
}

export const getTypographyScale = (baseSize: number = 18): TypographyScale => ({
  title: baseSize * 2.5,    // 45pt at 18pt base
  subtitle: baseSize * 1.5,  // 27pt
  heading: baseSize * 1.33,  // 24pt
  body: baseSize,            // 18pt
  caption: baseSize * 0.85,  // 15pt
});

export const calculateOptimalFontSize = (
  text: string,
  width: number,
  height: number,
  maxSize: number = 32,
  minSize: number = 12
): number => {
  // Simple heuristic: adjust based on character count and available space
  const charCount = text.length;
  const area = width * height;
  const charDensity = charCount / area;

  let fontSize = maxSize;

  // Reduce font size if text density is high
  if (charDensity > 0.01) {
    fontSize = Math.max(minSize, maxSize * 0.7);
  } else if (charDensity > 0.005) {
    fontSize = Math.max(minSize, maxSize * 0.85);
  }

  return Math.round(fontSize);
};

// Smart line breaking for titles
export const breakLongTitle = (title: string, maxLength: number = 60): string[] => {
  if (title.length <= maxLength) {
    return [title];
  }

  const words = title.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxLength) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }

  if (currentLine) lines.push(currentLine);

  return lines;
};

// Calculate line height based on font size
export const calculateLineHeight = (fontSize: number): number => {
  return fontSize * 1.4; // 1.4 is a standard comfortable line height ratio
};
