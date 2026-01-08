import { Spacing } from '@slide-agent/shared';

export const DEFAULT_SPACING: Spacing = {
  slideMargin: 40,
  elementPadding: 20,
  lineHeight: 1.4,
  paragraphSpacing: 16,
};

export const calculateElementSpacing = (elementCount: number, availableHeight: number): number => {
  // Distribute space evenly between elements with minimum spacing
  const MIN_SPACING = 12;
  const MAX_SPACING = 40;

  if (elementCount <= 1) return 0;

  const calculatedSpacing = (availableHeight * 0.1) / (elementCount - 1);
  return Math.max(MIN_SPACING, Math.min(MAX_SPACING, calculatedSpacing));
};

export const calculateBulletSpacing = (bulletCount: number): number => {
  // More bullets = tighter spacing
  if (bulletCount <= 3) return 20;
  if (bulletCount <= 5) return 16;
  return 12;
};

export const getContentPadding = (elementType: string): { top: number; right: number; bottom: number; left: number } => {
  switch (elementType) {
    case 'title':
      return { top: 0, right: 0, bottom: 20, left: 0 };
    case 'bullet_list':
      return { top: 10, right: 20, bottom: 10, left: 40 };
    case 'text':
      return { top: 10, right: 20, bottom: 10, left: 20 };
    case 'chart':
      return { top: 20, right: 20, bottom: 20, left: 20 };
    default:
      return { top: 10, right: 10, bottom: 10, left: 10 };
  }
};

// Calculate white space ratio - aim for 30-40% white space on slide
export const calculateWhiteSpaceRatio = (
  contentArea: number,
  totalArea: number
): number => {
  return ((totalArea - contentArea) / totalArea) * 100;
};

export const isWhiteSpaceAdequate = (ratio: number): boolean => {
  return ratio >= 25 && ratio <= 50;
};
