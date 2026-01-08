import { SlideTemplate } from './index';

export const titleTemplate: SlideTemplate = {
  type: 'title',
  name: 'Title Slide',
  description: 'Main title slide with optional subtitle',
  regions: [
    {
      name: 'title',
      cell: { row: 2, col: 1, rowSpan: 2, colSpan: 10 },
      elementType: 'title',
    },
    {
      name: 'subtitle',
      cell: { row: 4, col: 1, rowSpan: 1, colSpan: 10 },
      elementType: 'text',
      optional: true,
    },
    {
      name: 'author',
      cell: { row: 6, col: 1, rowSpan: 1, colSpan: 10 },
      elementType: 'text',
      optional: true,
    },
  ],
};
