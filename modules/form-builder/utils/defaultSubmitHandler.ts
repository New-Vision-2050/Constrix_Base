import { FormConfig } from '../types/formTypes';

/**
 * Default submit handler for form submissions
 * Makes a POST request to the apiUrl specified in the form config
 * Handles Laravel validation errors
 */
export const defaultSubmitHandler = async (
  values: Record<string, any>,
  config: FormConfig
): Promise<{ success: boolean; message?: string; errors?: Record<string, string | string[]> }> => {
  try {
    // Check if apiUrl is provided
    if (!config.apiUrl) {
      console.error('No apiUrl provided in form configuration');
      return { 
        success: false, 
        message: 'API URL not configured' 
      };
    }

    // Import apiClient here to avoid circular dependencies
    const { apiClient } = await import('@/config/axios-config');
    
    // Make the POST request to the API
    const response = await apiClient.post(
      config.apiUrl,
      values,
      { headers: config.apiHeaders }
    );

    // Return success response
    return { 
      success: true,
      message: response.data?.message || 'Form submitted successfully' 
    };
  } catch (error: any) {
    console.error('Form submission error:', error);
    
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