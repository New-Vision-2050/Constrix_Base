import { FormConfig } from "../types/formTypes";

/**
 * Handles form submission errors
 * Processes both Laravel validation errors and general errors
 */
export const handleFormSubmissionError = (
  error: any,
  config: FormConfig
): {
  success: boolean;
  message?: string;
  errors?: Record<string, string | string[]>;
} => {
  console.log("Form submission error:", error);

  // Handle Laravel validation errors
  if (error.response?.status === 422 && config.laravelValidation?.enabled) {
    const errorsPath = config.laravelValidation.errorsPath || "errors";
    const validationErrors = error.response.data?.[errorsPath] || {};

    // Return the validation errors in the expected format
    return {
      success: false,
      message: error.response.data?.message || "Validation failed",
      errors: validationErrors,
    };
  }

  // Handle other errors
  return {
    success: false,
    message:
      error.response?.data?.message || error.message || "An error occurred",
  };
};