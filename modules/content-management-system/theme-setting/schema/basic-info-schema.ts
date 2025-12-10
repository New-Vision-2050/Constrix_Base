import { z } from "zod";

/**
 * Validates URL format
 * Ensures URL strings are properly formatted
 */
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Basic information schema for theme settings
 * Contains website icon and URL
 */
export const basicInfoSchema = z.object({
  websiteIcon: z
    .union([z.instanceof(File), z.null()])
    .refine(
      (file) => file === null || file === undefined || file instanceof File,
      { message: "Website icon must be a valid file" }
    )
    .refine(
      (file) => {
        if (!file || !(file instanceof File)) return true;
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/x-icon"];
        return validTypes.includes(file.type);
      },
      { message: "Website icon must be a valid image format (png, jpg, svg, ico)" }
    )
    .refine(
      (file) => {
        if (!file || !(file instanceof File)) return true;
        const maxSize = 2 * 1024 * 1024; // 2MB
        return file.size <= maxSize;
      },
      { message: "Website icon size must not exceed 2MB" }
    ),
  
  websiteUrl: z
    .string()
    .min(1, "Website URL is required")
    .transform((val) => val?.trim() || ""),
});

/**
 * Type export for basic info schema
 */
export type BasicInfo = z.infer<typeof basicInfoSchema>;

