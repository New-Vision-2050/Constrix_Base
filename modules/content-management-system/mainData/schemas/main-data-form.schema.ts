import { z } from "zod";

/**
 * Creates a Zod schema for main data form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for main data form validation
 */
export const createMainDataFormSchema = (t: (key: string) => string) =>
  z.object({
    site_title: z.string().optional(),
    site_logo: z.any().optional(),
    primary_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, { message: t("validation.invalidColor") })
      .default("#FFFFFF"),
    secondary_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, { message: t("validation.invalidColor") })
      .default("#FFFFFF"),
    background_color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, { message: t("validation.invalidColor") })
      .default("#E89623"),
  });

/**
 * Type inference from the main data form schema
 * Usage: const formData: MainDataFormData = {...}
 */
export type MainDataFormData = z.infer<
  ReturnType<typeof createMainDataFormSchema>
>;

/**
 * Default form values for main data form
 * Provides initial state for React Hook Form
 */
export const getDefaultMainDataFormValues = (): MainDataFormData => ({
  site_title: "",
  site_logo: undefined,
  primary_color: "#FFFFFF",
  secondary_color: "#FFFFFF",
  background_color: "#E89623",
});
