import { z } from "zod";

/**
 * Schema for project type item
 * Used in the project types array
 */
const projectTypeSchema = z.object({
  name_ar: z
    .string({
      required_error: "Project type name in Arabic is required",
    })
    .min(1, {
      message: "Project type name in Arabic is required",
    })
    .min(2, {
      message: "Project type name in Arabic must be at least 2 characters",
    })
    .trim(),

  name_en: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 2,
      {
        message:
          "Project type name in English must be at least 2 characters if provided",
      }
    )
    .transform((val) => val?.trim() || ""),

  projects_count: z
    .number({
      required_error: "Number of projects is required",
    })
    .int({
      message: "Number of projects must be an integer",
    })
    .min(0, {
      message: "Number of projects must be 0 or greater",
    }),
});

/**
 * Schema for attachment item
 * Used in the attachments array
 */
const attachmentSchema = z.object({
  file_name: z
    .string({
      required_error: "File name is required",
    })
    .min(1, {
      message: "File name is required",
    })
    .min(2, {
      message: "File name must be at least 2 characters",
    })
    .trim(),

  file: z
    .union([z.instanceof(File), z.null()])
    .refine(
      (file) =>
        file === null ||
        file === undefined ||
        file instanceof File,
      {
        message: "Attachment file must be a valid file",
      }
    )
    .refine(
      (file) => {
        if (!file || !(file instanceof File)) return true;
        // Check if it's a PDF file
        return file.type === "application/pdf";
      },
      {
        message: "Attachment file must be a PDF file",
      }
    ),
});

/**
 * Creates a Zod schema for about setting form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for about setting form validation
 */
export const createAboutSettingFormSchema = (t: (key: string) => string) =>
  z.object({
    // Main Section
    section_image: z
      .union([z.instanceof(File), z.null()])
      .refine(
        (file) =>
          file === null ||
          file === undefined ||
          file instanceof File,
        {
          message:
            t("sectionImageInvalid") || "Section image must be a valid file",
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
            t("sectionImageSizeExceeded") ||
            "Section image size must not exceed 3MB",
        }
      ),

    title: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 2,
        {
          message:
            t("titleMinLength") ||
            "Title must be at least 2 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    description: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("descriptionMinLength") ||
            "Description must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    // Page Sections - About Us Icons
    about_us_icons: z
      .array(z.string())
      .min(1, {
        message:
          t("aboutUsIconsRequired") ||
          "At least one About Us icon must be selected",
      })
      .default([]),

    // Page Sections - About Us
    about_us_ar: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("aboutUsArMinLength") ||
            "About Us in Arabic must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    about_us_en: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("aboutUsEnMinLength") ||
            "About Us in English must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    // Page Sections - Vision
    vision_ar: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("visionArMinLength") ||
            "Vision in Arabic must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    vision_en: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("visionEnMinLength") ||
            "Vision in English must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    // Page Sections - Company Goal
    company_goal_ar: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("companyGoalArMinLength") ||
            "Company goal in Arabic must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    company_goal_en: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("companyGoalEnMinLength") ||
            "Company goal in English must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    // Page Sections - Company Slogan
    company_slogan_ar: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("companySloganArMinLength") ||
            "Company slogan in Arabic must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    company_slogan_en: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 10,
        {
          message:
            t("companySloganEnMinLength") ||
            "Company slogan in English must be at least 10 characters if provided",
        }
      )
      .transform((val) => val?.trim() || ""),

    // Project Types
    project_types: z
      .array(projectTypeSchema)
      .default([]),

    // Attachments
    attachments: z
      .array(attachmentSchema)
      .default([]),
  });

/**
 * Type inference from the about setting form schema
 * Usage: const formData: AboutSettingFormData = {...}
 */
export type AboutSettingFormData = z.infer<
  ReturnType<typeof createAboutSettingFormSchema>
>;

/**
 * Type for project type item
 */
export type ProjectTypeItem = z.infer<typeof projectTypeSchema>;

/**
 * Type for attachment item
 */
export type AttachmentItem = z.infer<typeof attachmentSchema>;

/**
 * Default form values for about setting form
 * Provides initial state for React Hook Form
 */
export const getDefaultAboutSettingFormValues = (): AboutSettingFormData => ({
  section_image: null,
  title: "",
  description: "",
  about_us_icons: [],
  about_us_ar: "",
  about_us_en: "",
  vision_ar: "",
  vision_en: "",
  company_goal_ar: "",
  company_goal_en: "",
  company_slogan_ar: "",
  company_slogan_en: "",
  project_types: [],
  attachments: [],
});

