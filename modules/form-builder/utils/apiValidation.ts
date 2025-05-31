import { ValidationRule } from "../types/formTypes";
import { useFormStore } from "../hooks/useFormStore";

// Define types for the different kinds of stores we might receive
type GlobalFormStore = ReturnType<typeof useFormStore.getState>;
type FormInstance = { formId?: string };

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
  fieldName: string,
  value: any,
  rule: ValidationRule,
  store?: GlobalFormStore | FormInstance,
  currentFormId?: string
): void => {
  if (rule.type !== "apiValidation" || !rule.apiConfig) {
    return;
  }

  // Use the provided store or get it from the global state
  const formStore = store || useFormStore.getState();
  const globalStore = useFormStore.getState();

  // Determine which formId to use
  let formId: string;
  if (currentFormId) {
    formId = currentFormId;
    globalStore.validateFieldWithApi(formId, fieldName, value, rule);
  } else if ("formId" in formStore && typeof formStore.formId === "string") {
    // If it's a form instance with formId property
    formId = formStore.formId;
    globalStore.validateFieldWithApi(formId, fieldName, value, rule);
  } else {
    // Fallback to active form ID
    formId = globalStore.activeFormId;
    globalStore.validateFieldWithApi(formId, fieldName, value, rule);
  }

  console.log("ApiValidation formId", formId);
};

/**
 * Checks if a field has an API validation rule
 *
 * @param rules The validation rules for the field
 * @returns boolean - True if the field has an API validation rule
 */
export const hasApiValidation = (rules?: ValidationRule[]): boolean => {
  if (!rules) return false;

  return rules.some(
    (rule) => rule.type === "apiValidation" && !!rule.apiConfig
  );
};
