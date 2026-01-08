import { SlideTemplate } from './index';

export const comparisonTemplate: SlideTemplate = {
  type: 'comparison',
  name: 'Comparison',
  description: 'Compare two or more items side by side',
  regions: [
    {
      name: 'title',
      cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 },
      elementType: 'title',
    },
    {
      name: 'option_a_header',
      cell: { row: 1, col: 0, rowSpan: 1, colSpan: 5 },
      elementType: 'text',
    },
    {
      name: 'option_b_header',
      cell: { row: 1, col: 7, rowSpan: 1, colSpan: 5 },
      elementType: 'text',
    },
    {
      name: 'option_a_content',
      cell: { row: 2, col: 0, rowSpan: 5, colSpan: 5 },
      elementType: 'bullet_list',
    },
    {
      name: 'option_b_content',
      cell: { row: 2, col: 7, rowSpan: 5, colSpan: 5 },
      elementType: 'bullet_list',
    },
  ],
};
