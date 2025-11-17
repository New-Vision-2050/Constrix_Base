import { z } from "zod";

/**
 * Creates a Zod schema for founder form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @param isEditMode - Whether the form is in edit mode (affects image validation)
 * @returns Zod schema object for founder form validation
 */
export const createFounderFormSchema = (
  t: (key: string) => string,
  isEditMode: boolean = false
) =>
  z.object({
    name_ar: z
      .string({
        required_error: t("form.nameArRequired"),
      })
      .min(1, {
        message: t("form.nameArRequired"),
      })
      .min(2, {
        message: t("form.nameArMinLength"),
      })
      .trim(),

    name_en: z
      .string({
        required_error: t("form.nameEnRequired"),
      })
      .min(1, {
        message: t("form.nameEnRequired"),
      })
      .min(2, {
        message: t("form.nameEnMinLength"),
      })
      .trim(),

    job_title_ar: z
      .string({
        required_error: t("form.jobTitleArRequired"),
      })
      .min(1, {
        message: t("form.jobTitleArRequired"),
      })
      .min(2, {
        message: t("form.jobTitleArMinLength"),
      })
      .trim(),

    job_title_en: z
      .string({
        required_error: t("form.jobTitleEnRequired"),
      })
      .min(1, {
        message: t("form.jobTitleEnRequired"),
      })
      .min(2, {
        message: t("form.jobTitleEnMinLength"),
      })
      .trim(),

    description_ar: z
      .string({
        required_error: t("form.descriptionArRequired"),
      })
      .min(1, {
        message: t("form.descriptionArRequired"),
      }),

    description_en: z
      .string({
        required_error: t("form.descriptionEnRequired"),
      })
      .min(1, {
        message: t("form.descriptionEnRequired"),
      }),

    profile_image: isEditMode
      ? z.union([z.instanceof(File), z.null()]).optional()
      : z
          .union([z.instanceof(File), z.null()])
          .refine(
            (file) => file !== null && file !== undefined,
            {
              message: t("form.profileImageRequired"),
            }
          ),
  });

/**
 * Type inference from the founder form schema
 * Usage: const formData: FounderFormData = {...}
 * Note: This is a base type. The actual schema type may vary based on isEditMode.
 */
export type FounderFormData = z.infer<ReturnType<typeof createFounderFormSchema>>;

/**
 * Default form values for founder form
 * Provides initial state for React Hook Form
 */
export const getDefaultFounderFormValues = (): FounderFormData => ({
  name_ar: "",
  name_en: "",
  job_title_ar: "",
  job_title_en: "",
  description_ar: "",
  description_en: "",
  profile_image: null,
});

