import { z } from "zod";

/**
 * Validates hex color format
 * Ensures color strings follow hex pattern (#RRGGBB or #RGB)
 */
const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

/**
 * Base color schema for simple color objects
 * Used for common and background colors (light & dark only)
 */
export const simpleColorSchema = z.object({
  light: z
    .string()
    .regex(hexColorRegex, "Light color must be a valid hex color")
    .trim(),
  
  dark: z
    .string()
    .regex(hexColorRegex, "Dark color must be a valid hex color")
    .trim(),
});

/**
 * Extended color schema with full palette
 * Used for primary, secondary, info, warning, error, and text colors
 */
export const fullColorSchema = z.object({
  main: z
    .string()
    .regex(hexColorRegex, "Main color must be a valid hex color")
    .trim(),
  
  light: z
    .string()
    .regex(hexColorRegex, "Light color must be a valid hex color")
    .trim(),
  
  dark: z
    .string()
    .regex(hexColorRegex, "Dark color must be a valid hex color")
    .trim(),
  
  contrastText: z
    .string()
    .regex(hexColorRegex, "Contrast text color must be a valid hex color")
    .trim(),
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

