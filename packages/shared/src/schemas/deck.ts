import { z } from 'zod';

export const AudienceTypeSchema = z.enum(['executive', 'technical', 'general']);
export const GoalTypeSchema = z.enum(['persuade', 'inform', 'educate', 'report']);
export const DeckStatusSchema = z.enum(['draft', 'planning', 'layout', 'review', 'completed', 'failed']);

export const CreateDeckInputSchema = z.object({
  title: z.string().min(1).max(200),
  startMode: z.enum(['outline', 'document', 'blank', 'table', 'meeting_notes']),
  audience: AudienceTypeSchema,
  goal: GoalTypeSchema,
  targetSlides: z.number().int().min(3).max(50).default(10),
  themeId: z.string().optional(),
  inputContent: z.string().optional(),
  uploadedFileId: z.string().optional(),
});

export const DeckSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: DeckStatusSchema,
  audience: AudienceTypeSchema,
  goal: GoalTypeSchema,
  targetSlides: z.number(),
  themeId: z.string().nullable(),
  organizationId: z.string(),
  createdById: z.string(),
  version: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const DeckPlanSchema = z.object({
  outline: z.array(z.object({
    title: z.string(),
    type: z.string(),
    keyPoints: z.array(z.string()),
    notes: z.string().optional(),
  })),
  narrative: z.string(),
  agenda: z.array(z.string()),
  talkTrack: z.string().optional(),
});

export type AudienceType = z.infer<typeof AudienceTypeSchema>;
export type GoalType = z.infer<typeof GoalTypeSchema>;
export type DeckStatus = z.infer<typeof DeckStatusSchema>;
export type CreateDeckInput = z.infer<typeof CreateDeckInputSchema>;
export type Deck = z.infer<typeof DeckSchema>;
export type DeckPlan = z.infer<typeof DeckPlanSchema>;
