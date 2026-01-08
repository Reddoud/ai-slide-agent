import { z } from 'zod';

export const JobTypeSchema = z.enum([
  'plan_deck',
  'layout_deck',
  'quality_check',
  'render_pptx',
  'parse_document',
  'process_table',
  'generate_content',
]);

export const JobStatusSchema = z.enum([
  'pending',
  'active',
  'completed',
  'failed',
  'delayed',
]);

export const JobSchema = z.object({
  id: z.string(),
  type: JobTypeSchema,
  status: JobStatusSchema,
  deckId: z.string(),
  data: z.record(z.any()),
  result: z.record(z.any()).optional(),
  error: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  attempts: z.number().default(0),
  createdAt: z.date(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
});

export type JobType = z.infer<typeof JobTypeSchema>;
export type JobStatus = z.infer<typeof JobStatusSchema>;
export type Job = z.infer<typeof JobSchema>;
