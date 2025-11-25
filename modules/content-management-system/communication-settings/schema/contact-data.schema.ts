import { z } from "zod";

/**
 * Email validation regex pattern
 * Validates standard email format: user@domain.extension
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Phone validation regex pattern
 * Supports international formats with optional country code and various separators
 */
const PHONE_PATTERN = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;

/**
 * Validation constraints for contact data fields
 */
const CONSTRAINTS = {
  EMAIL_MAX_LENGTH: 255,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,
} as const;

/**
 * Creates a Zod schema for contact data form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only contact data validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for contact data form validation
 */
export const createContactDataSchema = (t: (key: string) => string) =>
  z.object({
    // Email address field with comprehensive validation
    email: z
      .string()
      .min(1, t("emailRequired") || "Email is required")
      .email(t("emailInvalid") || "Invalid email address")
      .regex(EMAIL_PATTERN, t("emailInvalid") || "Invalid email address")
      .max(CONSTRAINTS.EMAIL_MAX_LENGTH, `Maximum ${CONSTRAINTS.EMAIL_MAX_LENGTH} characters`),

    // Phone number field with length and format validation
    phone: z
      .string()
      .min(1, t("phoneRequired") || "Phone number is required")
      .min(CONSTRAINTS.PHONE_MIN_LENGTH, t("phoneMinLength") || "Phone must be at least 10 digits")
      .max(CONSTRAINTS.PHONE_MAX_LENGTH, t("phoneMaxLength") || "Phone must not exceed 20 digits")
      .regex(PHONE_PATTERN, t("phoneInvalid") || "Invalid phone number"),
  });

/**
 * Type inference from the contact data schema
 * Usage: const formData: ContactDataFormValues = {...}
 */
export type ContactDataFormValues = z.infer<ReturnType<typeof createContactDataSchema>>;

/**
 * Default values for contact data form initialization
 */
export const DEFAULT_CONTACT_DATA: ContactDataFormValues = {
  email: "",
  phone: "",
};

/**
 * Contact Info Type
 * Represents contact information from API
 */
export interface ContactInfo {
  email: string;
  phone: string;
}

