import { z } from 'zod';

export const ElementTypeSchema = z.enum([
  'text',
  'title',
  'bullet_list',
  'image',
  'chart',
  'diagram',
  'icon',
  'shape',
  'table',
]);

export const ChartTypeSchema = z.enum(['bar', 'line', 'pie', 'scatter', 'area']);

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});

export const TextStyleSchema = z.object({
  fontFamily: z.string().optional(),
  fontSize: z.number().optional(),
  color: z.string().optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  align: z.enum(['left', 'center', 'right', 'justify']).optional(),
});

export const ElementSchema = z.object({
  id: z.string(),
  slideId: z.string(),
  type: ElementTypeSchema,
  position: PositionSchema,
  content: z.any(),
  style: TextStyleSchema.optional(),
  locked: z.boolean().default(false),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ChartDataSchema = z.object({
  type: ChartTypeSchema,
  labels: z.array(z.string()),
  datasets: z.array(z.object({
    label: z.string(),
    data: z.array(z.number()),
    color: z.string().optional(),
  })),
  options: z.record(z.any()).optional(),
});

export const DiagramNodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['rect', 'circle', 'diamond']).optional(),
});

export const DiagramEdgeSchema = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
});

export const DiagramDataSchema = z.object({
  nodes: z.array(DiagramNodeSchema),
  edges: z.array(DiagramEdgeSchema),
});

export type ElementType = z.infer<typeof ElementTypeSchema>;
export type ChartType = z.infer<typeof ChartTypeSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type TextStyle = z.infer<typeof TextStyleSchema>;
export type Element = z.infer<typeof ElementSchema>;
export type ChartData = z.infer<typeof ChartDataSchema>;
export type DiagramData = z.infer<typeof DiagramDataSchema>;
