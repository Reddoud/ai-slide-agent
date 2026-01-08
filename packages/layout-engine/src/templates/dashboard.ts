import { SlideTemplate } from './index';

export const dashboardTemplate: SlideTemplate = {
  type: 'kpi_dashboard',
  name: 'KPI Dashboard',
  description: 'Display key metrics and charts',
  regions: [
    {
      name: 'title',
      cell: { row: 0, col: 0, rowSpan: 1, colSpan: 12 },
      elementType: 'title',
    },
    {
      name: 'kpi_1',
      cell: { row: 1, col: 0, rowSpan: 2, colSpan: 3 },
      elementType: 'text',
    },
    {
      name: 'kpi_2',
      cell: { row: 1, col: 3, rowSpan: 2, colSpan: 3 },
      elementType: 'text',
    },
    {
      name: 'kpi_3',
      cell: { row: 1, col: 6, rowSpan: 2, colSpan: 3 },
      elementType: 'text',
    },
    {
      name: 'kpi_4',
      cell: { row: 1, col: 9, rowSpan: 2, colSpan: 3 },
      elementType: 'text',
    },
    {
      name: 'chart',
      cell: { row: 3, col: 1, rowSpan: 4, colSpan: 10 },
      elementType: 'chart',
    },
  ],
};
