import { z } from 'zod';

// API Response wrappers
export const ApiSuccessSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  meta: z.record(z.any()).optional(),
});

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

export const ApiResponseSchema = z.union([ApiSuccessSchema, ApiErrorSchema]);

// Pagination
export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const PaginatedResponseSchema = z.object({
  items: z.array(z.any()),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// AI Control actions
export const AIActionSchema = z.enum([
  'rewrite_title',
  'tighten_bullets',
  'generate_subtitle',
  'suggest_visual',
  'create_diagram',
  'generate_notes',
]);

export const AIActionRequestSchema = z.object({
  action: AIActionSchema,
  elementId: z.string(),
  context: z.record(z.any()).optional(),
  tone: z.enum(['consulting', 'startup', 'academic']).optional(),
  verbosity: z.enum(['concise', 'normal', 'detailed']).optional(),
});

export type ApiSuccess = z.infer<typeof ApiSuccessSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiResponse = z.infer<typeof ApiResponseSchema>;
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type PaginatedResponse = z.infer<typeof PaginatedResponseSchema>;
export type AIAction = z.infer<typeof AIActionSchema>;
export type AIActionRequest = z.infer<typeof AIActionRequestSchema>;
