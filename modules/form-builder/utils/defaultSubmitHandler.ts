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
  data?: any;
}> => {
  try {
    // Log the form submission
    console.log(
      "Default submit handler - Submitting form with values:",
      values
    );

    // Determine which URL, headers and method to use based on mode
    let apiUrl, apiHeaders, apiMethod;
    if (config.isEditMode) {
      // In edit mode, use editApiUrl if available, otherwise fall back to apiUrl
      apiUrl = config.editApiUrl || config.apiUrl;

      // If editApiUrl contains :id placeholder, replace it with recordId from values
      if (apiUrl && apiUrl.includes(':id') && values.id) {
        apiUrl = apiUrl.replace(':id', values.id);
      }

      apiHeaders = config.editApiHeaders || config.apiHeaders;
      apiMethod = config.editApiMethod || 'PUT';
    } else {
      // In create mode, use apiUrl and apiHeaders
      apiUrl = config.apiUrl;
      apiHeaders = config.apiHeaders;
      apiMethod = config.apiMethod || 'POST';
    }

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

    // Make the API request using the specified method
    let response;

    switch (apiMethod) {
      case 'PUT':
        response = await apiClient.put(apiUrl, values, { headers: apiHeaders });
        break;
      case 'PATCH':
        response = await apiClient.patch(apiUrl, values, { headers: apiHeaders });
        break;
      case 'DELETE':
        response = await apiClient.delete(apiUrl, { headers: apiHeaders, data: values });
        break;
      case 'POST':
      default:
        response = await apiClient.post(apiUrl, values, { headers: apiHeaders });
        break;
    }

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
