import { FormConfig } from "../types/formTypes";
import { RequestOptions } from "../types/requestTypes";
import { handleFormSubmissionError } from "./handleFormSubmissionError";

/**
 * Default submit handler for form submissions
 * Makes a POST request to the apiUrl specified in the form config
 * Handles Laravel validation errors
 *
 * @param values - Form values to submit
 * @param config - Form configuration
 * @param options - Optional request options to override URL, method, and add request config
 */
export const defaultSubmitHandler = async (
  values: Record<string, any>,
  config: FormConfig,
  options?: RequestOptions,
): Promise<{
  success: boolean;
  message?: string;
  errors?: Record<string, string | string[]>;
  data?: any;
}> => {
  try {
    // Determine which URL, headers and method to use based on mode or custom options
    let apiUrl = options?.url;
    let apiMethod = options?.method;
    let apiHeaders;
    const params = config?.apiParams;

    console.log({ params });

    // If URL is not provided in options, determine from config
    if (!apiUrl) {
      if (config.isEditMode) {
        // In edit mode, use editApiUrl if available, otherwise fall back to apiUrl
        apiUrl = config.editApiUrl || config.apiUrl;

        // If editApiUrl contains :id placeholder, replace it with recordId from values
        if (apiUrl && apiUrl.includes(":id") && values.id) {
          apiUrl = apiUrl.replace(":id", values.id);
        }
      } else {
        // In create mode, use apiUrl
        apiUrl = config.apiUrl;
      }
    }

    if (params && apiUrl) {
      console.log("in param condition");
      const url = new URL(apiUrl, window.location.origin);
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
      apiUrl = url.toString();
    }

    // If method is not provided in options, determine from config
    if (!apiMethod) {
      if (config.isEditMode) {
        apiMethod = config.editApiMethod || "PUT";
      } else {
        apiMethod = config.apiMethod || "POST";
      }
    }

    // Determine headers from config
    if (config.isEditMode) {
      apiHeaders = config.editApiHeaders || config.apiHeaders;
    } else {
      apiHeaders = config.apiHeaders;
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

    // Prepare request config by merging headers with any custom config
    const requestConfig = {
      headers: apiHeaders,
      ...options?.config,
    };

    // Make the API request using the specified method
    let response;

    switch (apiMethod) {
      case "PUT":
        response = await apiClient.put(apiUrl, values, requestConfig);
        break;
      case "PATCH":
        response = await apiClient.patch(apiUrl, values, requestConfig);
        break;
      case "DELETE":
        response = await apiClient.delete(apiUrl, {
          ...requestConfig,
          data: values,
        });
        break;
      case "GET":
        response = await apiClient.get(apiUrl, {
          ...requestConfig,
          params: values,
        });
        break;
      case "POST":
      default:
        response = await apiClient.post(apiUrl, values, requestConfig);
        break;
    }

    const responseData = response?.data;

    // Handle backend returning success: false with HTTP 200
    if (responseData?.success === false) {
      return {
        success: false,
        message: responseData?.message || "Form submission failed",
        errors: responseData?.errors || {},
        data: responseData || {},
      };
    }

    // Return success response
    return {
      success: true,
      message: responseData?.message || "Form submitted successfully",
      data: responseData || {},
    };
  } catch (error: any) {
    return handleFormSubmissionError(error, config);
  }
};
