import { z } from "zod";

/**
 * Creates a Zod schema for service form validation
 */
export const createServiceFormSchema = (
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

    request_id: z
      .string({
        required_error: t("requestIdRequired"),
      })
      .min(1, {
        message: t("requestIdRequired"),
      }),

    category_id: z
      .string({
        required_error: t("categoryRequired"),
      })
      .min(1, {
        message: t("categoryRequired"),
      }),

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

    is_featured: z.boolean().default(false),

    icon_image: isEditMode
      ? z.union([z.instanceof(File), z.string(), z.null()]).optional()
      : z
          .union([z.instanceof(File), z.null()])
          .refine((file) => file !== null && file !== undefined, {
            message: t("iconImageRequired"),
          }),

    main_image: isEditMode
      ? z.union([z.instanceof(File), z.string(), z.null()]).optional()
      : z
          .union([z.instanceof(File), z.null()])
          .refine((file) => file !== null && file !== undefined, {
            message: t("mainImageRequired"),
          }),

    previous_works: z
      .array(
        z.object({
          id: z.string(),
          description: z
            .string({
              required_error: t("previousWorkDescriptionRequired"),
            })
            .min(1, {
              message: t("previousWorkDescriptionRequired"),
            }),
          image: z.union([z.instanceof(File), z.string(), z.null()]).optional(),
        })
      )
      .optional(),
  });

/**
 * Type inference from the service form schema
 */
export type ServiceFormData = z.infer<ReturnType<typeof createServiceFormSchema>>;

/**
 * Default form values for service form
 */
export const getDefaultServiceFormValues = (): ServiceFormData => ({
  name_ar: "",
  name_en: "",
  request_id: "",
  category_id: "",
  description_ar: "",
  description_en: "",
  is_featured: false,
  icon_image: null,
  main_image: null,
  previous_works: [],
});

