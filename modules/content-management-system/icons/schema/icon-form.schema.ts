import { z } from "zod";

/**
 * Creates a Zod schema for icon form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for icon form validation
 */
export const createIconFormSchema = (t: (key: string) => string) =>
  z.object({
    name_ar: z
      .string({
        required_error:
          t("nameArRequired") || "Icon name in Arabic is required",
      })
      .min(1, {
        message:
          t("nameArRequired") || "Icon name in Arabic is required",
      })
      .min(2, {
        message:
          t("nameArMinLength") ||
          "Icon name in Arabic must be at least 2 characters",
      })
      .trim(),

    name_en: z
      .string({
        required_error:
          t("nameEnRequired") || "Icon name in English is required",
      })
      .min(1, {
        message:
          t("nameEnRequired") || "Icon name in English is required",
      })
      .min(2, {
        message:
          t("nameEnMinLength") ||
          "Icon name in English must be at least 2 characters",
      })
      .trim(),

    category_id: z
      .string({
        required_error:
          t("categoryRequired") || "Category is required",
      })
      .min(1, {
        message: t("categoryRequired") || "Category is required",
      }),

    logo_image: z
      .union([z.instanceof(File), z.null()])
      .refine(
        (file) =>
          file === null ||
          file === undefined ||
          file instanceof File,
        {
          message:
            t("logoImageInvalid") || "Logo image must be a valid file",
        }
      )
      .refine(
        (file) => {
          if (!file || !(file instanceof File)) return true;
          const maxSize = 3 * 1024 * 1024; // 3MB
          return file.size <= maxSize;
        },
        {
          message:
            t("logoImageSizeExceeded") ||
            "Logo image size must not exceed 3MB",
        }
      ),
  });

/**
 * Type inference from the icon form schema
 * Usage: const formData: IconFormData = {...}
 */
export type IconFormData = z.infer<
  ReturnType<typeof createIconFormSchema>
>;

/**
 * Default form values for icon form
 * Provides initial state for React Hook Form
 */
export const getDefaultIconFormValues = (): IconFormData => ({
  name_ar: "",
  name_en: "",
  category_id: "",
  logo_image: null,
});

