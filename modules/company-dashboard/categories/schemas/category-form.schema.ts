import { z } from "zod";

/**
 * Creates a Zod schema for category form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for category form validation
 */
export const createCategoryFormSchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z
      .string({
        required_error:
          t("category.nameArRequired") || "Category name in Arabic is required",
      })
      .min(1, {
        message:
          t("category.nameArRequired") || "Category name in Arabic is required",
      })
      .min(2, {
        message:
          t("category.nameArMinLength") ||
          "Category name in Arabic must be at least 2 characters",
      })
      .trim(),

    name_en: z
      .string({
        required_error:
          t("category.nameEnRequired") ||
          "Category name in English is required",
      })
      .min(1, {
        message:
          t("category.nameEnRequired") ||
          "Category name in English is required",
      })
      .min(2, {
        message:
          t("category.nameEnMinLength") ||
          "Category name in English must be at least 2 characters",
      })
      .trim(),

    type: z
      .string({
        required_error:
          t("category.typeRequired") || "Category type is required",
      })
      .min(1, {
        message:
          t("category.typeRequired") || "Category type is required",
      }),
  });

/**
 * Type inference from the category form schema
 * Usage: const formData: CategoryFormData = {...}
 */
export type CategoryFormData = z.infer<
  ReturnType<typeof createCategoryFormSchema>
>;

/**
 * Default form values for category form
 * Provides initial state for React Hook Form
 */
export const getDefaultCategoryFormValues = (): CategoryFormData => ({
  name_ar: "",
  name_en: "",
  type: "",
});

