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
 * Validates icon URL or identifier
 */
const socialIconSchema = z
  .string()
  .min(1, "Social icon is required")
  .refine(
    (icon) => icon.length <= 500,
    "Icon identifier must be less than 500 characters"
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
 */
export const socialLinkDefaultValues: SocialLinkFormData = {
  type: "facebook",
  url: "",
  social_icon: "",
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

