import { z } from "zod";

/**
 * Creates a Zod schema for news form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @param isEditMode - Whether the form is in edit mode (affects image validation)
 * @returns Zod schema object for news form validation
 */
export const createNewsFormSchema = (
  t: (key: string) => string,
  isEditMode: boolean = false
) =>
  z.object({
    title_ar: z
      .string({
        required_error: t("form.titleArRequired"),
      })
      .min(1, {
        message: t("form.titleArRequired"),
      })
      .min(2, {
        message: t("form.titleArMinLength"),
      })
      .trim(),

    title_en: z
      .string({
        required_error: t("form.titleEnRequired"),
      })
      .min(1, {
        message: t("form.titleEnRequired"),
      })
      .min(2, {
        message: t("form.titleEnMinLength"),
      })
      .trim(),

    content_ar: z
      .string({
        required_error: t("form.contentArRequired"),
      })
      .min(1, {
        message: t("form.contentArRequired"),
      }),

    content_en: z
      .string({
        required_error: t("form.contentEnRequired"),
      })
      .min(1, {
        message: t("form.contentEnRequired"),
      }),

    category_id: z
      .string({
        required_error: t("form.categoryRequired"),
      })
      .min(1, {
        message: t("form.categoryRequired"),
      }),

    publish_date: z
      .string({
        required_error: t("form.publishDateRequired"),
      })
      .min(1, {
        message: t("form.publishDateRequired"),
      }),

    end_date: z.string().optional(),

    thumbnail_image: isEditMode
      ? z.union([z.instanceof(File), z.string(), z.null()]).optional()
      : z
        .union([z.instanceof(File), z.null()])
        .refine((file) => file !== null && file !== undefined, {
          message: t("form.thumbnailImageRequired"),
        }),

    main_image: isEditMode
      ? z.union([z.instanceof(File), z.string(), z.null()]).optional()
      : z
        .union([z.instanceof(File), z.null()])
        .refine((file) => file !== null && file !== undefined, {
          message: t("form.mainImageRequired"),
        }),
  });

/**
 * Type inference from the news form schema
 * Usage: const formData: NewsFormData = {...}
 * Note: This is a base type. The actual schema type may vary based on isEditMode.
 */
export type NewsFormData = z.infer<ReturnType<typeof createNewsFormSchema>>;

/**
 * Default form values for news form
 * Provides initial state for React Hook Form
 */
export const getDefaultNewsFormValues = (): NewsFormData => ({
  title_ar: "",
  title_en: "",
  content_ar: "",
  content_en: "",
  category_id: "",
  publish_date: "",
  end_date: "",
  thumbnail_image: null,
  main_image: null,
});
