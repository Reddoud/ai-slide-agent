import { SlideTemplate } from './index';

export const twoColumnTemplate: SlideTemplate = {
  type: 'two_column',
  name: 'Two Column',
  description: 'Content split into two columns',
  regions: [
    {
      name: 'title',
      cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 },
      elementType: 'title',
    },
    {
      name: 'left_column',
      cell: { row: 1, col: 0, rowSpan: 6, colSpan: 5 },
      elementType: 'bullet_list',
    },
    {
      name: 'right_column',
      cell: { row: 1, col: 7, rowSpan: 6, colSpan: 5 },
      elementType: 'bullet_list',
    },
  ],
};
