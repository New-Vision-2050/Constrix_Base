import { z } from "zod";
export const createMainSettingsFormSchema = (t: (key: string) => string) =>
  z.object({
    web_video_link: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || val.trim().length === 0 || isValidUrl(val), {
        message:
          t("videoLinkWebInvalid") || "Web video link must be a valid URL",
      })
      .transform((val) => val?.trim() || null),

    web_video_file: z
      .any()
      .nullable()
      .refine(
        (file) =>
          file === null ||
          file === undefined ||
          file instanceof File ||
          typeof file === "string",
        {
          message:
            t("videoFileWebInvalid") || "Web video file must be a valid file",
        }
      )
      .refine(
        (file) => {
          if (!file || typeof file === "string") return true;
          if (!(file instanceof File)) return true;
          // Check if it's a video file
          const validTypes = [
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/mov",
            "video/avi",
            "video/wmv",
            "video/flv",
            "video/mkv",
          ];
          return validTypes.includes(file.type);
        },
        {
          message:
            t("videoFileWebTypeInvalid") ||
            "Web video file must be a valid video format",
        }
      ),

    mobile_video_link: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || val.trim().length === 0 || isValidUrl(val), {
        message:
          t("videoLinkMobileInvalid") ||
          "Mobile video link must be a valid URL",
      })
      .transform((val) => val?.trim() || null),

    mobile_video_file: z
      .any()
      .nullable()
      .refine(
        (file) =>
          file === null ||
          file === undefined ||
          file instanceof File ||
          typeof file === "string",
        {
          message:
            t("videoFileMobileInvalid") ||
            "Mobile video file must be a valid file",
        }
      )
      .refine(
        (file) => {
          if (!file || typeof file === "string") return true;
          if (!(file instanceof File)) return true;
          // Check if it's a video file
          const validTypes = [
            "video/mp4",
            "video/webm",
            "video/ogg",
            "video/mov",
            "video/avi",
            "video/wmv",
            "video/flv",
            "video/mkv",
          ];
          return validTypes.includes(file.type);
        },
        {
          message:
            t("videoFileMobileTypeInvalid") ||
            "Mobile video file must be a valid video format",
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

    // Page Sections - Homepage Sections (matching API field names)
    is_companies: z
      .union([z.literal(0), z.literal(1), z.boolean()])
      .transform((val) => (typeof val === "boolean" ? (val ? 1 : 0) : val))
      .default(0),

    is_approvals: z
      .union([z.literal(0), z.literal(1), z.boolean()])
      .transform((val) => (typeof val === "boolean" ? (val ? 1 : 0) : val))
      .default(0),

    is_certificates: z
      .union([z.literal(0), z.literal(1), z.boolean()])
      .transform((val) => (typeof val === "boolean" ? (val ? 1 : 0) : val))
      .default(0),

    // Page Sections - Company Profile (matching API field name)
    video_profile_file: z
      .any()
      .nullable()
      .refine(
        (file) =>
          file === null ||
          file === undefined ||
          file instanceof File ||
          typeof file === "string",
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

export type MainSettingsFormData = z.infer<
  ReturnType<typeof createMainSettingsFormSchema>
>;

export const getDefaultMainSettingsFormValues = (): MainSettingsFormData => ({
  web_video_link: null,
  web_video_file: null,
  mobile_video_link: null,
  mobile_video_file: null,
  description_ar: "",
  description_en: "",
  is_companies: 0,
  is_approvals: 0,
  is_certificates: 0,
  video_profile_file: null,
});

/**
 * Map API response to form data
 */
export const mapApiResponseToFormData = (data: {
  web_video_link?: string | null;
  web_video_file?: string | null;
  mobile_video_link?: string | null;
  mobile_video_file?: string | null;
  video_profile_file?: string | null;
  description?: string | null;
  description_en?: string | null;
  is_companies?: 0 | 1;
  is_approvals?: 0 | 1;
  is_certificates?: 0 | 1;
}): Partial<MainSettingsFormData> => {
  // Map homepage icons from API boolean fields
  const homepageIcons: string[] = [];
  if (data.is_companies === 1) homepageIcons.push("companies");
  if (data.is_approvals === 1) homepageIcons.push("accreditations");
  if (data.is_certificates === 1) homepageIcons.push("certificates");

  return {
    web_video_link: data.web_video_link || null,
    web_video_file: data.web_video_file || null, // URL string from API
    mobile_video_link: data.mobile_video_link || null,
    mobile_video_file: data.mobile_video_file || null, // URL string from API
    description_ar: data.description || "",
    description_en: data.description_en || "",
    is_companies: data.is_companies || 0,
    is_approvals: data.is_approvals || 0,
    is_certificates: data.is_certificates || 0,
    video_profile_file: data.video_profile_file || null, // URL string from API
  };
};
