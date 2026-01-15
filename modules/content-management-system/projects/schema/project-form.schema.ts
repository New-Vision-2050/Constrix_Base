import { z } from "zod";

/**
 * Project detail item schema
 * Represents a single detail entry with Arabic/English text and service
 */
const createProjectDetailSchema = (t: (key: string) => string) =>
  z.object({
    detail_ar: z
      .string({
        required_error: t("detailArRequired") || "Detail in Arabic is required",
      })
      .min(1, {
        message: t("detailArRequired") || "Detail in Arabic is required",
      })
      .min(2, {
        message:
          t("detailArMinLength") ||
          "Detail in Arabic must be at least 2 characters",
      })
      .trim(),

    detail_en: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 2,
        {
          message:
            t("detailEnMinLength") ||
            "Detail in English must be at least 2 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

   service_id: z
      .string({
        required_error: t("serviceRequired") || "Service is required",
      })
      .min(1, {
        message: t("serviceRequired") || "Service is required",
      }),
  });
/**
 * Creates a Zod schema for project form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for project form validation
 */
export const createProjectFormSchema = (t: (key: string) => string) =>
  z
    .object({
      // Featured Services Section
      is_featured: z.boolean().default(false),

      main_image: z
        .any()
        .nullable()
        .refine(
          (file) =>
            file === null ||
            file === undefined ||
            file instanceof File,
          {
            message:
              t("mainImageInvalid") || "Main image must be a valid file",
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
              t("mainImageSizeExceeded") ||
              "Main image size must not exceed 3MB",
          }
        ),

      sub_images: z
        .array(z.any())
        .default([])
        .refine(
          (files) =>
            files.every(
              (file) =>
                file === null ||
                file === undefined ||
                file instanceof File ||
                typeof file === "string" ||
                (typeof file === "object" && file?.id && file?.url) // Allow {id, url} objects
            ),
          {
            message:
              t("subImagesInvalid") || "Sub images must be valid files or URLs",
          }
        )
        .refine(
          (files) => {
            const maxSize = 3 * 1024 * 1024; // 3MB
            return files.every(
              (file) =>
                !file ||
                typeof file === "string" || // Skip validation for URLs
                (typeof file === "object" && file?.id && file?.url) || // Skip validation for {id, url} objects
                !(file instanceof File) ||
                file.size <= maxSize
            );
          },
          {
            message:
              t("subImagesSizeExceeded") ||
              "Each sub image size must not exceed 3MB",
          }
        ),

      // Core Project Details
      title_ar: z
        .string({
          required_error:
            t("titleArRequired") || "Project title in Arabic is required",
        })
        .min(1, {
          message:
            t("titleArRequired") || "Project title in Arabic is required",
        })
        .min(2, {
          message:
            t("titleArMinLength") ||
            "Project title in Arabic must be at least 2 characters",
        })
        .trim(),

      title_en: z
        .string()
        .optional()
        .refine(
          (val) => !val || val.length >= 2,
          {
            message:
              t("titleEnMinLength") ||
              "Project title in English must be at least 2 characters if provided",
          }
        )
        .transform((val) => val?.trim() || ""),

      type: z
        .string({
          required_error:
            t("typeRequired") || "Project type is required",
        })
        .min(1, {
          message: t("typeRequired") || "Project type is required",
        }),

      name_ar: z
        .string({
          required_error:
            t("nameArRequired") || "Project name in Arabic is required",
        })
        .min(1, {
          message:
            t("nameArRequired") || "Project name in Arabic is required",
        })
        .min(2, {
          message:
            t("nameArMinLength") ||
            "Project name in Arabic must be at least 2 characters",
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
              "Project name in English must be at least 2 characters if provided",
          }
        )
        .transform((val) => val?.trim() || ""),

      description_ar: z
        .string({
          required_error:
            t("descriptionArRequired") ||
            "Project description in Arabic is required",
        })
        .min(1, {
          message:
            t("descriptionArRequired") ||
            "Project description in Arabic is required",
        })
        .min(10, {
          message:
            t("descriptionArMinLength") ||
            "Project description in Arabic must be at least 10 characters",
        })
        .trim(),

      description_en: z
        .string()
        .optional()
        .refine(
          (val) => !val || val.length >= 10,
          {
            message:
              t("descriptionEnMinLength") ||
              "Project description in English must be at least 10 characters if provided",
          }
        )
        .transform((val) => val?.trim() || ""),

      // Details Array (repeatable section)
      details: z
        .array(createProjectDetailSchema(t))
        .default([]),
    })
// .refine(
//   (data) => {
//     // If featured, main image is required
//     if (data.is_featured && !data.main_image) {
//       return false;
//     }
//     return true;
//   },
//   {
//     message:
//       t("mainImageRequiredWhenFeatured") ||
//       "Main image is required when project is featured",
//     path: ["main_image"],
//   }
// );

/**
 * Type inference from the project form schema
 * Usage: const formData: ProjectFormData = {...}
 */
export type ProjectFormData = z.infer<
  ReturnType<typeof createProjectFormSchema>
>;

/**
 * Project detail item type
 */
export type ProjectDetailItem = z.infer<
  ReturnType<typeof createProjectDetailSchema>
>;

/**
 * Default form values for project form
 * Provides initial state for React Hook Form
 */
export const getDefaultProjectFormValues = (): ProjectFormData => ({
  is_featured: false,
  main_image: null,
  sub_images: [],
  title_ar: "",
  title_en: "",
  type: "",
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  details: [],
});

