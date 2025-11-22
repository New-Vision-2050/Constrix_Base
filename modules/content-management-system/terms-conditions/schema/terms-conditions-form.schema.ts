import { z } from "zod";

/**
 * Creates a Zod schema for terms and conditions form validation
 * Follows SOLID principles:
 * - Single Responsibility: Handles only validation logic
 * - Open/Closed: Extensible via factory function pattern
 * - Dependency Inversion: Depends on translation abstraction
 *
 * @param t - Translation function for localized error messages
 * @returns Zod schema object for terms and conditions form validation
 */
export const createTermsConditionsFormSchema = (t: (key: string) => string) =>
  z.object({
    // Terms and Conditions Content
    content: z
      .string({
        required_error:
          t("contentRequired") ||
          "Terms and conditions content is required",
      })
      .min(1, {
        message:
          t("contentRequired") ||
          "Terms and conditions content is required",
      })
      .min(10, {
        message:
          t("contentMinLength") ||
          "Terms and conditions content must be at least 10 characters",
      })
      .trim(),
  });

/**
 * Type inference from the terms and conditions form schema
 * Usage: const formData: TermsConditionsFormData = {...}
 */
export type TermsConditionsFormData = z.infer<
  ReturnType<typeof createTermsConditionsFormSchema>
>;

/**
 * Default form values for terms and conditions form
 * Provides initial state for React Hook Form
 */
export const getDefaultTermsConditionsFormValues = (): TermsConditionsFormData => ({
  content: "",
});

