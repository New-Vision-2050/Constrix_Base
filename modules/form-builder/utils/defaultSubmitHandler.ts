import { FormConfig } from "../types/formTypes";

/**
 * Default submit handler for form submissions
 * Makes a POST request to the apiUrl specified in the form config
 * Handles Laravel validation errors
 */
export const defaultSubmitHandler = async (
  values: Record<string, any>,
  config: FormConfig
): Promise<{
  success: boolean;
  message?: string;
  errors?: Record<string, string | string[]>;
}> => {
  try {
    // Log the form submission
    console.log(
      "Default submit handler - Submitting form with values:",
      values
    );

    // For step-based forms (wizard or accordion), use the last step's API URL if available
    let apiUrl = config.apiUrl;
    let apiHeaders = config.apiHeaders;

    // If this is a step-based form (wizard or accordion)
    if (config.wizard || config.accordion) {
      const lastStepIndex = config.sections.length - 1;

      // Use the last step's API URL if available
      if (config.wizardOptions?.stepApiUrls?.[lastStepIndex]) {
        apiUrl = config.wizardOptions.stepApiUrls[lastStepIndex];
        console.log(`Using last step's API URL: ${apiUrl}`);
      }

      // Use the last step's API headers if available
      if (config.wizardOptions?.stepApiHeaders?.[lastStepIndex]) {
        apiHeaders = config.wizardOptions.stepApiHeaders[lastStepIndex];
      }
    }

    // Check if apiUrl is provided
    if (!apiUrl) {
      console.log("No apiUrl provided in form configuration");
      return {
        success: false,
        message: "API URL not configured",
      };
    }

    // Import apiClient here to avoid circular dependencies
    const { apiClient } = await import("@/config/axios-config");

    // Log the API URL being used
    console.log(`Default submit handler - Using API URL: ${apiUrl}`);

    // Make the POST request to the API
    const response = await apiClient.post(apiUrl, values, {
      headers: apiHeaders,
    });

    // Return success response
    return {
      success: true,
      message: response.data?.message || "Form submitted successfully",
      data: response.data || {},
    };
  } catch (error: any) {
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
  }
};
