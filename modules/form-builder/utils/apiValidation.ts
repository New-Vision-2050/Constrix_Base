import { ValidationRule } from '../types/formTypes';
import { useFormStore } from '../hooks/useFormStore';
import { apiClient } from '@/config/axios-config'; // Import apiClient
import { debounce } from 'lodash'; // Import debounce

// Define types for the different kinds of stores we might receive
type GlobalFormStore = ReturnType<typeof useFormStore.getState>;
type FormInstance = { formId?: string };

// Store debounced validation functions for each form and field
// Key: formId, Value: Map<fieldName, debouncedFunction>
const debouncedApiValidators = new Map<string, Map<string, ReturnType<typeof debounce>>>();

/**
 * Triggers API validation for a field with the apiValidation rule type
 *
 * @param fieldName The name of the field to validate
 * @param value The current value of the field
 * @param rule The validation rule containing API configuration
 * @param store Optional store instance to use instead of getting it from getState
 * @returns void - The validation result will be set in the form state
 */
export const triggerApiValidation = (
  formId: string, // Explicitly require formId
  fieldName: string,
  value: any,
  rule: ValidationRule,
  store: GlobalFormStore // Require the store instance
): void => {
  if (rule.type !== 'apiValidation' || !rule.apiConfig) {
    return;
  }

  const {
    url,
    method = "GET",
    debounceMs = 500,
    paramName = "value",
    headers = {},
    successCondition,
  } = rule.apiConfig;

  // Set field as validating immediately
  store.setFieldValidating(formId, fieldName, true);

  // Create a map for this form if it doesn't exist
  if (!debouncedApiValidators.has(formId)) {
    debouncedApiValidators.set(formId, new Map());
  }
  const formValidators = debouncedApiValidators.get(formId)!;

  // Create or get the debounced validation function for this field
  if (!formValidators.has(fieldName)) {
    const debouncedFn = debounce(
      async (currentValue: any) => { // Pass only the value to the debounced function
        try {
          // Prepare request config
          const config = {
            method,
            url,
            headers,
            ...(method === "GET"
              ? { params: { [paramName]: currentValue } }
              : { data: { [paramName]: currentValue } }),
          };

          // Make the API request using apiClient
          const response = await apiClient(config);

          // Check if validation passed
          let isValid = false;
          if (successCondition) {
            isValid = successCondition(response.data);
          } else if (response.data.available !== undefined) {
            isValid = response.data.available === true;
          } else if (response.data.success !== undefined) {
            isValid = response.data.success === true;
          } else if (response.data.valid !== undefined) {
            isValid = response.data.valid === true;
          } else if (response.data.isValid !== undefined) {
            isValid = response.data.isValid === true;
          } else {
            isValid = false; // Default to invalid if no condition/standard properties
          }

          // Update form state via the store instance
          if (!isValid) {
            store.setError(formId, fieldName, rule.message);
          } else {
            // Clear only the API validation error, preserve other potential errors
            const currentErrors = store.forms[formId]?.errors || {};
            if (currentErrors[fieldName] === rule.message) {
               store.setError(formId, fieldName, null);
            }
          }
        } catch (error) {
          console.error("API validation error:", error);
          store.setError(formId, fieldName, rule.message); // Set error on API failure
        } finally {
          // Set field as no longer validating
          store.setFieldValidating(formId, fieldName, false);
        }
      },
      debounceMs
    );
    formValidators.set(fieldName, debouncedFn);
  }

  // Execute the debounced validation
  const debouncedFn = formValidators.get(fieldName);
  if (debouncedFn) {
    debouncedFn(value); // Pass the current value
  }
};

// Function to clear debounced validators for a specific form
export const clearDebouncedValidators = (formId: string): void => {
  const formValidators = debouncedApiValidators.get(formId);
  if (formValidators) {
    formValidators.forEach(debouncedFn => debouncedFn.cancel()); // Cancel pending executions
    debouncedApiValidators.delete(formId); // Remove the form's map
  }
};

/**
 * Checks if a field has an API validation rule
 * 
 * @param rules The validation rules for the field
 * @returns boolean - True if the field has an API validation rule
 */
export const hasApiValidation = (rules?: ValidationRule[]): boolean => {
  if (!rules) return false;

  return rules.some(rule => rule.type === 'apiValidation' && !!rule.apiConfig);
};