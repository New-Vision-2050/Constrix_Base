import { z } from "zod";
import { basicInfoSchema } from "./basic-info-schema";
import { colorPaletteSchema } from "./color-schemas";
import { typographySchema } from "./typography-schema";

/**
 * Creates a Zod schema for theme settings form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for theme settings form validation
 */
export const createThemeSettingFormSchema = (t: (key: string) => string) =>
  z.object({
    // Basic website information
    basicInfo: basicInfoSchema,
    
    // Color palette configuration
    palette: colorPaletteSchema,
    
    // Border radius value in pixels
    borderRadius: z
      .number()
      .min(0, t("borderRadiusMin") || "Border radius must be 0 or greater")
      .max(50, t("borderRadiusMax") || "Border radius must not exceed 50px")
      .default(4),
    
    // Typography configuration
    typography: typographySchema,
  });

/**
 * Type inference from the theme setting form schema
 * Usage: const formData: ThemeSettingFormData = {...}
 */
export type ThemeSettingFormData = z.infer<
  ReturnType<typeof createThemeSettingFormSchema>
>;

