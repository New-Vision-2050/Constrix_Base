import { z } from "zod";
import libphonenumbers from "libphonenumbers";

/**
 * Email validation regex pattern
 * Validates standard email format: user@domain.extension
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validation constraints for contact data fields
 */
const CONSTRAINTS = {
  EMAIL_MAX_LENGTH: 255,
} as const;

/**
 * Phone validation function using libphonenumbers
 * Same validation logic as form builder
 */
const validatePhoneNumber = (phone: string): boolean => {
  const phoneUtil = libphonenumbers.PhoneNumberUtil.getInstance();
  try {
    const number = phoneUtil.parseAndKeepRawInput(phone);
    const splitValue = phone.split(" ");
    
    // Reject if national number starts with 0
    if (splitValue.length > 0 && splitValue[1]?.startsWith("0")) {
      return false;
    }
    
    return phoneUtil.isValidNumber(number);
  } catch (error) {
    return false;
  }
};

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

    // Phone number field with libphonenumbers validation (same as form builder)
    phone: z
      .string()
      .min(1, t("phoneRequired") || "Phone number is required")
      .refine(validatePhoneNumber, {
        message: t("phoneInvalid") || "رقم الجوال غير صحيح",
      }),
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

