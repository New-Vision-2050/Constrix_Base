import { z } from "zod";

/**
 * Validates hex color format
 * Ensures color strings follow hex pattern (#RRGGBB or #RGB)
 */
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Optional hex color validation
 * Allows empty string for cleared colors
 */
const optionalHexColor = z
  .string()
  .refine(
    (val) => !val || hexColorRegex.test(val),
    { message: "Color must be a valid hex color" }
  )
  .optional()
  .or(z.literal(""));

/**
 * Base color schema for simple color objects
 * Used for common and background colors (light & dark only)
 */
export const simpleColorSchema = z.object({
  light: optionalHexColor,
  dark: optionalHexColor,
});

/**
 * Extended color schema with full palette
 * Used for primary, secondary, info, warning, error, and text colors
 */
export const fullColorSchema = z.object({
  main: optionalHexColor,
  light: optionalHexColor,
  dark: optionalHexColor,
  contrastText: optionalHexColor,
});

/**
 * Complete color palette schema
 * Combines all color definitions for the theme
 */
export const colorPaletteSchema = z.object({
  common: simpleColorSchema,
  background: simpleColorSchema,
  primary: fullColorSchema,
  secondary: fullColorSchema,
  info: fullColorSchema,
  warning: fullColorSchema,
  error: fullColorSchema,
  text: fullColorSchema,
});

/**
 * Type exports for color schemas
 */
export type SimpleColor = z.infer<typeof simpleColorSchema>;
export type FullColor = z.infer<typeof fullColorSchema>;
export type ColorPalette = z.infer<typeof colorPaletteSchema>;

