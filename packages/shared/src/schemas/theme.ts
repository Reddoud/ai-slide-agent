import { z } from 'zod';

export const ColorPaletteSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  background: z.string(),
  text: z.string(),
  textSecondary: z.string(),
});

export const TypographySchema = z.object({
  headingFont: z.string(),
  bodyFont: z.string(),
  h1Size: z.number(),
  h2Size: z.number(),
  h3Size: z.number(),
  bodySize: z.number(),
});

export const SpacingSchema = z.object({
  slideMargin: z.number(),
  elementPadding: z.number(),
  lineHeight: z.number(),
  paragraphSpacing: z.number(),
});

export const ThemeSchema = z.object({
  id: z.string(),
  name: z.string(),
  colors: ColorPaletteSchema,
  typography: TypographySchema,
  spacing: SpacingSchema,
  logoUrl: z.string().optional(),
  backgroundImage: z.string().optional(),
  organizationId: z.string().nullable(),
  isPublic: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ColorPalette = z.infer<typeof ColorPaletteSchema>;
export type Typography = z.infer<typeof TypographySchema>;
export type Spacing = z.infer<typeof SpacingSchema>;
export type Theme = z.infer<typeof ThemeSchema>;
