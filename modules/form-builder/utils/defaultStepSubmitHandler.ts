import { FormConfig } from '../types/formTypes';

/**
 * Default submit handler for step submissions in wizard forms
 * Makes a POST request to the apiUrl specified for the step or falls back to the form config
 * Handles Laravel validation errors
 */
export const defaultStepSubmitHandler = async (
  step: number,
  values: Record<string, any>,
  config: FormConfig
): Promise<{ success: boolean; message?: string; data?: Record<string, any>; errors?: Record<string, string | string[]> }> => {
  try {
    // Get the API URL for this step
    const stepApiUrl = config.wizardOptions?.stepApiUrls?.[step];
    const apiUrl = stepApiUrl || config.apiUrl;
    
    // Check if apiUrl is provided
    if (!apiUrl) {
      console.error(`No apiUrl provided for step ${step}`);
      return { 
        success: false, 
        message: 'API URL not configured for this step' 
      };
    }

    // Import apiClient here to avoid circular dependencies
    const { apiClient } = await import('@/config/axios-config');
    
    // Get the API headers for this step or fall back to form config
    const stepApiHeaders = config.wizardOptions?.stepApiHeaders?.[step];
    const headers = stepApiHeaders || config.apiHeaders;
    
    // Make the POST request to the API
    const response = await apiClient.post(
      apiUrl,
      values,
      { headers }
    );

    // Return success response with data from the response
    return { 
      success: true,
      message: response.data?.message || `Step ${step + 1} submitted successfully`,
      data: response.data
    };
  } catch (error: any) {
    console.error(`Step ${step} submission error:`, error);
    
    // Handle Laravel validation errors
    if (error.response?.status === 422 && config.laravelValidation?.enabled) {
      const errorsPath = config.laravelValidation.errorsPath || 'errors';
      const validationErrors = error.response.data?.[errorsPath] || {};
      
      // Return the validation errors in the expected format
      return {
        success: false,
        message: error.response.data?.message || 'Validation failed',
        errors: validationErrors
      };
    }
    
    // Handle other errors
    return {
      success: false,
      message: error.response?.data?.message || error.message || 'An error occurred'
    };
  }
};