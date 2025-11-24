import { z } from "zod";

/**
 * Typography schema for theme settings
 * Defines font-related properties following Material-UI conventions
 */
export const typographySchema = z.object({
  htmlFontSize: z
    .number()
    .int("HTML font size must be an integer")
    .min(10, "HTML font size must be at least 10px")
    .max(24, "HTML font size must not exceed 24px")
    .default(16),
  
  fontFamily: z
    .string()
    .min(1, "Font family is required")
    .trim()
    .default('"Roboto", "Helvetica", "Arial", sans-serif'),
  
  fontSize: z
    .number()
    .int("Font size must be an integer")
    .min(10, "Font size must be at least 10px")
    .max(24, "Font size must not exceed 24px")
    .default(14),
  
  fontWeightLight: z
    .number()
    .int("Font weight light must be an integer")
    .min(100, "Font weight light must be at least 100")
    .max(900, "Font weight light must not exceed 900")
    .default(300),
  
  fontWeightRegular: z
    .number()
    .int("Font weight regular must be an integer")
    .min(100, "Font weight regular must be at least 100")
    .max(900, "Font weight regular must not exceed 900")
    .default(400),
  
  fontWeightMedium: z
    .number()
    .int("Font weight medium must be an integer")
    .min(100, "Font weight medium must be at least 100")
    .max(900, "Font weight medium must not exceed 900")
    .default(500),
  
  fontWeightBold: z
    .number()
    .int("Font weight bold must be an integer")
    .min(100, "Font weight bold must be at least 100")
    .max(900, "Font weight bold must not exceed 900")
    .default(700),
});

/**
 * Type export for typography schema
 */
export type Typography = z.infer<typeof typographySchema>;

