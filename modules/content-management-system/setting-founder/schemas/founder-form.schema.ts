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
        required_error: t("nameArRequired"),
      })
      .min(1, {
        message: t("nameArRequired"),
      })
      .min(2, {
        message: t("nameArMinLength"),
      })
      .trim(),

    name_en: z
      .string({
        required_error: t("nameEnRequired"),
      })
      .min(1, {
        message: t("nameEnRequired"),
      })
      .min(2, {
        message: t("nameEnMinLength"),
      })
      .trim(),

    job_title_ar: z
      .string({
        required_error: t("jobTitleArRequired"),
      })
      .min(1, {
        message: t("jobTitleArRequired"),
      })
      .min(2, {
        message: t("jobTitleArMinLength"),
      })
      .trim(),

    job_title_en: z
      .string({
        required_error: t("jobTitleEnRequired"),
      })
      .min(1, {
        message: t("jobTitleEnRequired"),
      })
      .min(2, {
        message: t("jobTitleEnMinLength"),
      })
      .trim(),

    description_ar: z
      .string({
        required_error: t("descriptionArRequired"),
      })
      .min(1, {
        message: t("descriptionArRequired"),
      }),

    description_en: z
      .string({
        required_error: t("descriptionEnRequired"),
      })
      .min(1, {
        message: t("descriptionEnRequired"),
      }),

    profile_image: isEditMode
      ? z.union([z.instanceof(File), z.string(), z.null()]).optional()
      : z
          .union([z.instanceof(File), z.null()])
          .refine((file) => file !== null && file !== undefined, {
            message: t("profileImageRequired"),
          }),
  });

/**
 * Type inference from the founder form schema
 * Usage: const formData: FounderFormData = {...}
 * Note: This is a base type. The actual schema type may vary based on isEditMode.
 */
export type FounderFormData = z.infer<
  ReturnType<typeof createFounderFormSchema>
>;

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
