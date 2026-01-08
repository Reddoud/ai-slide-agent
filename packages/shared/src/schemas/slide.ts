import { z } from 'zod';

export const SlideTypeSchema = z.enum([
  'title',
  'agenda',
  'section_divider',
  'two_column',
  'problem_solution',
  'timeline',
  'process',
  'comparison',
  'kpi_dashboard',
  'case_study',
  'roadmap',
  'quote',
  'appendix',
  'content',
]);

export const SlideSchema = z.object({
  id: z.string(),
  deckId: z.string(),
  type: SlideTypeSchema,
  order: z.number(),
  title: z.string(),
  subtitle: z.string().optional(),
  notes: z.string().optional(),
  layoutData: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type SlideType = z.infer<typeof SlideTypeSchema>;
export type Slide = z.infer<typeof SlideSchema>;
