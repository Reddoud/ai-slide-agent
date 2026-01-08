import { SlideType } from '@slide-agent/shared';
import { GridCell } from '../grid';

export interface SlideTemplate {
  type: SlideType;
  name: string;
  description: string;
  regions: Array<{
    name: string;
    cell: GridCell;
    elementType: string;
    optional?: boolean;
  }>;
}

export * from './title';
export * from './two-column';
export * from './comparison';
export * from './timeline';
export * from './dashboard';

// Template registry
import { titleTemplate } from './title';
import { twoColumnTemplate } from './two-column';
import { comparisonTemplate } from './comparison';
import { timelineTemplate } from './timeline';
import { dashboardTemplate } from './dashboard';

export const TEMPLATE_REGISTRY: Record<SlideType, SlideTemplate> = {
  title: titleTemplate,
  two_column: twoColumnTemplate,
  comparison: comparisonTemplate,
  timeline: timelineTemplate,
  kpi_dashboard: dashboardTemplate,
  // Defaults for other types
  agenda: {
    type: 'agenda',
    name: 'Agenda',
    description: 'List of topics to be covered',
    regions: [
      { name: 'title', cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 }, elementType: 'title' },
      { name: 'content', cell: { row: 1, col: 1, rowSpan: 6, colSpan: 10 }, elementType: 'bullet_list' },
    ],
  },
  section_divider: {
    type: 'section_divider',
    name: 'Section Divider',
    description: 'Marks a new section',
    regions: [
      { name: 'title', cell: { row: 3, col: 1, rowSpan: 2, colSpan: 10 }, elementType: 'title' },
    ],
  },
  problem_solution: {
    type: 'problem_solution',
    name: 'Problem / Solution',
    description: 'Shows problem and solution side by side',
    regions: [
      { name: 'title', cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 }, elementType: 'title' },
      { name: 'problem', cell: { row: 1, col: 0, rowSpan: 6, colSpan: 5 }, elementType: 'bullet_list' },
      { name: 'solution', cell: { row: 1, col: 7, rowSpan: 6, colSpan: 5 }, elementType: 'bullet_list' },
    ],
  },
  process: {
    type: 'process',
    name: 'Process Flow',
    description: 'Shows sequential steps',
    regions: [
      { name: 'title', cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 }, elementType: 'title' },
      { name: 'diagram', cell: { row: 1, col: 1, rowSpan: 6, colSpan: 10 }, elementType: 'diagram' },
    ],
  },
  case_study: {
    type: 'case_study',
    name: 'Case Study',
    description: 'Detailed example or story',
    regions: [
      { name: 'title', cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 }, elementType: 'title' },
      { name: 'content', cell: { row: 1, col: 1, rowSpan: 5, colSpan: 10 }, elementType: 'text' },
      { name: 'takeaway', cell: { row: 6, col: 1, rowSpan: 1, colSpan: 10 }, elementType: 'text' },
    ],
  },
  roadmap: {
    type: 'roadmap',
    name: 'Roadmap',
    description: 'Timeline of future plans',
    regions: [
      { name: 'title', cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 }, elementType: 'title' },
      { name: 'timeline', cell: { row: 1, col: 1, rowSpan: 6, colSpan: 10 }, elementType: 'diagram' },
    ],
  },
  quote: {
    type: 'quote',
    name: 'Quote',
    description: 'Highlighted quotation',
    regions: [
      { name: 'quote', cell: { row: 2, col: 2, rowSpan: 3, colSpan: 8 }, elementType: 'text' },
      { name: 'attribution', cell: { row: 5, col: 2, rowSpan: 1, colSpan: 8 }, elementType: 'text' },
    ],
  },
  appendix: {
    type: 'appendix',
    name: 'Appendix',
    description: 'Supporting data and details',
    regions: [
      { name: 'title', cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 }, elementType: 'title' },
      { name: 'content', cell: { row: 1, col: 0, rowSpan: 6, colSpan: 12 }, elementType: 'text' },
    ],
  },
  content: {
    type: 'content',
    name: 'Content',
    description: 'General content slide',
    regions: [
      { name: 'title', cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 }, elementType: 'title' },
      { name: 'content', cell: { row: 1, col: 1, rowSpan: 6, colSpan: 10 }, elementType: 'bullet_list' },
    ],
  },
};

export const getTemplate = (type: SlideType): SlideTemplate => {
  return TEMPLATE_REGISTRY[type] || TEMPLATE_REGISTRY.content;
};
