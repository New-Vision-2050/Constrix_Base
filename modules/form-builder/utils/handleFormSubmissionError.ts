import { FormConfig } from "../types/formTypes";

/**
 * Handles form submission errors
 * Processes both Laravel validation errors and general errors
 */
export const handleFormSubmissionError = (
  error: any,
  config: FormConfig,
): {
  success: boolean;
  message?: string;
  errors?: Record<string, string | string[]>;
} => {
  console.log("Form submission error:", error);

  // Handle 422 validation errors - always extract message and errors
  if (error.response?.status === 422) {
    const errorsPath = config.laravelValidation?.errorsPath || "errors";
    const validationErrors = error.response.data?.[errorsPath] || {};

    return {
      success: false,
      message: error.response.data?.message || "Validation failed",
      errors: validationErrors,
    };
  }

  // Handle other errors - also extract errors if present
  return {
    success: false,
    message:
      error.response?.data?.message || error.message || "An error occurred",
    errors: error.response?.data?.errors || {},
  };
};
