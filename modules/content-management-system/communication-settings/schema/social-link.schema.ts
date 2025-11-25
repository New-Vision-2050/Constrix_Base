import { z } from "zod";

/**
 * Social Link Type Enum
 * Defines available social media platform types
 */
export const SocialLinkTypeEnum = z.enum([
  "facebook",
  "twitter",
  "instagram",
  "linkedin",
  "youtube",
  "tiktok",
  "snapchat",
  "whatsapp",
  "telegram",
  "pinterest",
  "other",
]);

/**
 * URL Validation Schema
 * Validates URL format with proper protocol
 */
const urlSchema = z
  .string()
  .min(1, "URL is required")
  .url("Please enter a valid URL")
  .refine(
    (url) => /^https?:\/\/.+/.test(url),
    "URL must start with http:// or https://"
  );

/**
 * Social Icon Validation Schema
 * Validates icon file upload
 */
const socialIconSchema = z
  .instanceof(File, { message: "Social icon is required" })
  .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type),
    "Only JPEG, PNG, and WebP formats are allowed"
  );

/**
 * Social Link Schema
 * Main validation schema for creating/editing social links
 */
export const socialLinkSchema = z.object({
  type: SocialLinkTypeEnum,
  url: urlSchema,
  social_icon: socialIconSchema,
});

/**
 * Type inference from schema
 * Use this type for type-safe form handling
 */
export type SocialLinkFormData = z.infer<typeof socialLinkSchema>;

/**
 * Default values for form initialization
 * Provides clean initial state
 * Note: social_icon must be set to a File object when used
 */
export const socialLinkDefaultValues: Partial<SocialLinkFormData> = {
  type: "facebook",
  url: "",
  // social_icon will be set via ImageUpload component
};

/**
 * Social Link Type Labels
 * Human-readable labels for each social platform
 */
export const SOCIAL_LINK_TYPE_LABELS: Record<
  z.infer<typeof SocialLinkTypeEnum>,
  string
> = {
  facebook: "Facebook",
  twitter: "Twitter",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
  tiktok: "TikTok",
  snapchat: "Snapchat",
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  pinterest: "Pinterest",
  other: "Other",
};

