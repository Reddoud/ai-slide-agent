// Re-export all types
export * from '../schemas/deck';
export * from '../schemas/slide';
export * from '../schemas/element';
export * from '../schemas/theme';
export * from '../schemas/job';
export * from '../schemas/api';

// Quality check types
export interface QualityIssue {
  id: string;
  slideId: string;
  elementId?: string;
  severity: 'error' | 'warning' | 'info';
  category: 'text_density' | 'consistency' | 'narrative' | 'chart' | 'fact';
  message: string;
  suggestion?: string;
}

export interface QualityReport {
  deckId: string;
  score: number;
  issues: QualityIssue[];
  passedChecks: string[];
  timestamp: Date;
}

// Layout types
export interface LayoutRule {
  name: string;
  apply: (slide: any) => any;
}

export interface GridConfig {
  columns: number;
  rows: number;
  gutterX: number;
  gutterY: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
}

// AI Tool definitions
export interface AITool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, any>;
      required: string[];
    };
  };
}
