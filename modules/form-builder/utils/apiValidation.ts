import { ValidationRule } from '../types/formTypes';
import { useFormStore } from '../hooks/useFormStore';

/**
 * Triggers API validation for a field with the apiValidation rule type
 * 
 * @param fieldName The name of the field to validate
 * @param value The current value of the field
 * @param rule The validation rule containing API configuration
 * @returns void - The validation result will be set in the form state
 */
export const triggerApiValidation = (
  fieldName: string,
  value: any,
  rule: ValidationRule
): void => {
  if (rule.type !== 'apiValidation' || !rule.apiConfig) {
    return;
  }
  
  // Get the form store instance
  const store = useFormStore.getState();
  
  // Trigger API validation
  store.validateFieldWithApi(fieldName, value, rule);
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