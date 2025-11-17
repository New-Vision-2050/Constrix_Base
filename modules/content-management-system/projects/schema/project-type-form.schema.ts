import { z } from "zod";

/**
 * Creates a Zod schema for project type form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for project type form validation
 */
export const createProjectTypeFormSchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z
      .string({
        required_error:
          t("nameArRequired") || "Project type name in Arabic is required",
      })
      .min(1, {
        message:
          t("nameArRequired") || "Project type name in Arabic is required",
      })
      .min(2, {
        message:
          t("nameArMinLength") ||
          "Project type name in Arabic must be at least 2 characters",
      })
      .trim(),

    name_en: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 2,
        {
          message:
            t("nameEnMinLength") ||
            "Project type name in English must be at least 2 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    group: z
      .union([
        z.number().int().positive(),
        z.string().transform((val) => {
          if (!val || val.trim() === "") return undefined;
          const num = parseInt(val, 10);
          if (isNaN(num) || num <= 0) {
            throw new Error(t("groupInvalid") || "Group must be a valid positive number");
          }
          return num;
        }),
      ])
      .optional(),
  });

/**
 * Type inference from the project type form schema
 * Usage: const formData: ProjectTypeFormData = {...}
 */
export type ProjectTypeFormData = z.infer<
  ReturnType<typeof createProjectTypeFormSchema>
>;

/**
 * Default form values for project type form
 * Provides initial state for React Hook Form
 */
export const getDefaultProjectTypeFormValues = (): ProjectTypeFormData => ({
  name_ar: "",
  name_en: "",
  group: undefined,
});

