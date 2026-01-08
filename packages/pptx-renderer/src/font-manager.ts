// Font fallback strategy for PPTX rendering

export interface FontMapping {
  requested: string;
  fallback: string;
  available: boolean;
}

// Standard fonts available in most PowerPoint installations
const SAFE_FONTS = [
  'Arial',
  'Calibri',
  'Times New Roman',
  'Verdana',
  'Georgia',
  'Courier New',
  'Tahoma',
];

export class FontManager {
  private fontMappings: Map<string, string> = new Map();

  constructor() {
    // Initialize with common custom font mappings
    this.fontMappings.set('Helvetica', 'Arial');
    this.fontMappings.set('Helvetica Neue', 'Calibri');
    this.fontMappings.set('San Francisco', 'Calibri');
    this.fontMappings.set('Roboto', 'Arial');
    this.fontMappings.set('Open Sans', 'Calibri');
    this.fontMappings.set('Lato', 'Calibri');
    this.fontMappings.set('Montserrat', 'Arial');
  }

  getSafeFont(requestedFont: string): string {
    // If it's already a safe font, return it
    if (SAFE_FONTS.includes(requestedFont)) {
      return requestedFont;
    }

    // Check if we have a mapping
    if (this.fontMappings.has(requestedFont)) {
      return this.fontMappings.get(requestedFont)!;
    }

    // Default fallback
    return 'Arial';
  }

  addFontMapping(custom: string, fallback: string): void {
    if (SAFE_FONTS.includes(fallback)) {
      this.fontMappings.set(custom, fallback);
    }
  }

  getFontMappings(): FontMapping[] {
    return Array.from(this.fontMappings.entries()).map(([requested, fallback]) => ({
      requested,
      fallback,
      available: SAFE_FONTS.includes(fallback),
    }));
  }
}

export const defaultFontManager = new FontManager();
