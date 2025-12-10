import { z } from "zod";

/**
 * Latitude validation regex pattern
 * Valid range: -90 to 90 degrees
 */
const LATITUDE_PATTERN = /^-?([1-8]?[0-9](\.\d+)?|90(\.0+)?)$/;

/**
 * Longitude validation regex pattern
 * Valid range: -180 to 180 degrees
 */
const LONGITUDE_PATTERN = /^-?((1[0-7][0-9]|[1-9]?[0-9])(\.\d+)?|180(\.0+)?)$/;

/**
 * Validation constraints for address fields
 */
const CONSTRAINTS = {
  TITLE_MAX_LENGTH: 200,
  TITLE_MIN_LENGTH: 2,
  ADDRESS_MAX_LENGTH: 500,
  ADDRESS_MIN_LENGTH: 3,
} as const;

/**
 * Creates a Zod schema for address form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only address validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for address form validation
 */
export const createAddressSchema = (t: (key: string) => string) =>
  z.object({
    // Title in Arabic
    title_ar: z
      .string()
      .min(1, t("titleArRequired") || "Title in Arabic is required")
      .min(CONSTRAINTS.TITLE_MIN_LENGTH, `Minimum ${CONSTRAINTS.TITLE_MIN_LENGTH} characters`)
      .max(CONSTRAINTS.TITLE_MAX_LENGTH, `Maximum ${CONSTRAINTS.TITLE_MAX_LENGTH} characters`),

    // Title in English
    title_en: z
      .string()
      .min(1, t("titleEnRequired") || "Title in English is required")
      .min(CONSTRAINTS.TITLE_MIN_LENGTH, `Minimum ${CONSTRAINTS.TITLE_MIN_LENGTH} characters`)
      .max(CONSTRAINTS.TITLE_MAX_LENGTH, `Maximum ${CONSTRAINTS.TITLE_MAX_LENGTH} characters`),

    // Address text field with length validation
    address: z
      .string()
      .min(1, t("addressRequired") || "Address is required")
      .min(CONSTRAINTS.ADDRESS_MIN_LENGTH, `Minimum ${CONSTRAINTS.ADDRESS_MIN_LENGTH} characters`)
      .max(CONSTRAINTS.ADDRESS_MAX_LENGTH, `Maximum ${CONSTRAINTS.ADDRESS_MAX_LENGTH} characters`),

    // Latitude coordinate field with range validation
    latitude: z
      .string()
      .min(1, t("latitudeRequired") || "Latitude is required")
      .regex(LATITUDE_PATTERN, t("latitudeInvalid") || "Latitude must be between -90 and 90"),

    // Longitude coordinate field with range validation
    longitude: z
      .string()
      .min(1, t("longitudeRequired") || "Longitude is required")
      .regex(LONGITUDE_PATTERN, t("longitudeInvalid") || "Longitude must be between -180 and 180"),

    // Status field (optional)
    status: z.number().optional(),
  });

/**
 * Type inference from the address schema
 * Usage: const formData: AddressFormValues = {...}
 */
export type AddressFormValues = z.infer<ReturnType<typeof createAddressSchema>>;

/**
 * Default values for address form initialization
 */
export const DEFAULT_ADDRESS_DATA: AddressFormValues = {
  title_ar: "",
  title_en: "",
  address: "",
  latitude: "",
  longitude: "",
  status: 1,
};

