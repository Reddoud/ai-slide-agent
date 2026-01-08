import { SlideTemplate } from './index';

export const timelineTemplate: SlideTemplate = {
  type: 'timeline',
  name: 'Timeline',
  description: 'Chronological progression of events',
  regions: [
    {
      name: 'title',
      cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 },
      elementType: 'title',
    },
    {
      name: 'timeline',
      cell: { row: 2, col: 1, rowSpan: 4, colSpan: 10 },
      elementType: 'diagram',
    },
  ],
};
