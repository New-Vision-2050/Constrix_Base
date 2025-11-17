import { z } from "zod";

/**
 * Creates a Zod schema for main settings form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for main settings form validation
 */
export const createMainSettingsFormSchema = (t: (key: string) => string) =>
  z.object({
    // Main Section - Video Links
    video_link_web: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.trim().length === 0 || isValidUrl(val),
        {
          message:
            t("videoLinkWebInvalid") || "Web video link must be a valid URL",
        }
      )
      .transform((val) => val?.trim() || ""),

    video_file_web: z
      .any()
      .nullable()
      .refine(
        (file) =>
          file === null ||
          file === undefined ||
          file instanceof File,
        {
          message:
            t("videoFileWebInvalid") || "Web video file must be a valid file",
        }
      )
      .refine(
        (file) => {
          if (!file || !(file instanceof File)) return true;
          // Check if it's a video file
          const validTypes = ["video/mp4", "video/webm", "video/ogg"];
          return validTypes.includes(file.type);
        },
        {
          message:
            t("videoFileWebTypeInvalid") ||
            "Web video file must be a valid video format (mp4, webm, ogg)",
        }
      ),

    video_link_mobile: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.trim().length === 0 || isValidUrl(val),
        {
          message:
            t("videoLinkMobileInvalid") ||
            "Mobile video link must be a valid URL",
        }
      )
      .transform((val) => val?.trim() || ""),

    video_file_mobile: z
      .any()
      .nullable()
      .refine(
        (file) =>
          file === null ||
          file === undefined ||
          file instanceof File,
        {
          message:
            t("videoFileMobileInvalid") ||
            "Mobile video file must be a valid file",
        }
      )
      .refine(
        (file) => {
          if (!file || !(file instanceof File)) return true;
          // Check if it's a video file
          const validTypes = ["video/mp4", "video/webm", "video/ogg"];
          return validTypes.includes(file.type);
        },
        {
          message:
            t("videoFileMobileTypeInvalid") ||
            "Mobile video file must be a valid video format (mp4, webm, ogg)",
        }
      ),

    // Main Section - Descriptions
    description_ar: z
      .string({
        required_error:
          t("descriptionArRequired") ||
          "Main slide description in Arabic is required",
      })
      .min(1, {
        message:
          t("descriptionArRequired") ||
          "Main slide description in Arabic is required",
      })
      .min(10, {
        message:
          t("descriptionArMinLength") ||
          "Main slide description in Arabic must be at least 10 characters",
      })
      .trim(),

    description_en: z
      .string({
        required_error:
          t("descriptionEnRequired") ||
          "Main slide description in English is required",
      })
      .min(1, {
        message:
          t("descriptionEnRequired") ||
          "Main slide description in English is required",
      })
      .min(10, {
        message:
          t("descriptionEnMinLength") ||
          "Main slide description in English must be at least 10 characters",
      })
      .trim(),

    // Page Sections - Homepage Icons
    homepage_icons: z
      .array(z.string())
      .min(1, {
        message:
          t("homepageIconsRequired") ||
          "At least one homepage icon must be selected",
      })
      .default([]),

    // Page Sections - Company Profile
    company_profile_file: z
      .any()
      .nullable()
      .refine(
        (file) =>
          file === null ||
          file === undefined ||
          file instanceof File,
        {
          message:
            t("companyProfileFileInvalid") ||
            "Company profile file must be a valid file",
        }
      ),
  });

/**
 * Helper function to validate URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Type inference from the main settings form schema
 * Usage: const formData: MainSettingsFormData = {...}
 */
export type MainSettingsFormData = z.infer<
  ReturnType<typeof createMainSettingsFormSchema>
>;

/**
 * Default form values for main settings form
 * Provides initial state for React Hook Form
 */
export const getDefaultMainSettingsFormValues = (): MainSettingsFormData => ({
  video_link_web: "",
  video_file_web: null,
  video_link_mobile: "",
  video_file_mobile: null,
  description_ar: "",
  description_en: "",
  homepage_icons: [],
  company_profile_file: null,
});

