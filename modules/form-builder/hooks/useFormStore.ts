import { create } from "zustand";
import { ValidationRule } from "../types/formTypes";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useCallback, useRef } from "react";
import {apiClient} from "@/config/axios-config";
import {triggerApiValidation} from "@/modules/form-builder";
import {messages} from "@/config/messages";
import {boolean} from "zod";

// Store debounced validation functions for each form and field
const debouncedValidations = new Map<string, Map<string, ReturnType<typeof debounce>>>();

// Define the state for a single form instance
interface FormInstanceState {
  // Form values and state
  values: Record<string, any>;
  errors: Record<string, string | React.ReactNode>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
  validatingFields: Record<string, boolean>;
  isEditMode?: boolean; // Add isEditMode property
}

// Define the global store that holds multiple form instances
interface FormState {
  // Map of form instances by formId
  forms: Record<string, FormInstanceState>;

  // Current active form ID
  activeFormId: string;

  // Form actions
  setFormId: (formId: string) => void;
  initForm: (formId: string, initialValues?: Record<string, any>) => void;
  getValue: (formId: string, field: string) => any;
  getValues: (formId: string) => any;
  setValue: (formId: string, field: string, value: any) => void;
  setValues: (formId: string, values: Record<string, any>) => void;
  setError: (formId: string, field: string, error: string | React.ReactNode | null) => void;
  setErrors: (formId: string, errors: Record<string, string | React.ReactNode>) => void;
  setTouched: (formId: string, field: string, isTouched: boolean) => void;
  setAllTouched: (formId: string) => void;
  resetForm: (formId: string, values?: Record<string, any>) => void;
  setSubmitting: (formId: string, isSubmitting: boolean) => void;
  setIsValid: (formId: string, isValid: boolean) => void;
  incrementSubmitCount: (formId: string) => void;
  setFieldValidating: (formId: string, field: string, isValidating: boolean) => void;
  validateFieldWithApi: (
    formId: string,
    field: string,
    value: any,
    rule: ValidationRule
  ) => void;
  validateField: (
    formId: string,
    fieldName: string,
    value: any,
    rules: ValidationRule[],
    formValues: Record<string, any>
  ) => void;
  hasValidatingFields: (formId: string) => boolean;
  setEditMode: (formId: string, isEditMode: boolean) => void; // Add setEditMode action
}

// Default state for a new form instance
const getDefaultFormState = (initialValues: Record<string, any> = {}): FormInstanceState => ({
  values: initialValues,
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true,
  submitCount: 0,
  validatingFields: {},
  isEditMode: false, // Default isEditMode to false
});

// Create the store with proper server snapshot caching
export const useFormStore = create<FormState>((set, get) => ({
  // Initial state
  forms: {},
  activeFormId: 'default',

  // Set the active form ID
  setFormId: (formId: string) => set({ activeFormId: formId }),

  // Initialize a new form instance if it doesn't exist
  initForm: (formId: string, initialValues = {}) => set((state: FormState) => ({
    forms: {
      ...state.forms,
      [formId]: state.forms[formId] || getDefaultFormState(initialValues)
    }
  })),

  // Actions for specific form instances
  setValue: (formId: string, field: string, value: any) => {
    // Get the current state
    const state = get();
    const formState = state.forms[formId] || getDefaultFormState();

    // Only update if the value has actually changed
    if (formState.values[field] === value) {
      return;
    }

    // Update the value
    set((state: FormState) => ({
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          values: { ...formState.values, [field]: value },
        }
      }
    }));
  },

    // Actions for specific form instances
    getValue: (formId: string, field: string) => {
        // Get the current state
        const state = get();
        const formState = state.forms[formId] || getDefaultFormState();
        return formState.values[field]
    },   // Actions for specific form instances
    getValues: (formId: string,) => {
        // Get the current state
        const state = get();
        const formState = state.forms[formId] || getDefaultFormState();
        return formState.values
    },

  setValues: (formId: string, values: Record<string, any>) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          values: { ...formState.values, ...values },
        }
      }
    };
  }),

  setError: (formId: string, field: string, error: string | React.ReactNode | null) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    const newErrors = error
      ? { ...formState.errors, [field]: error }
      : Object.fromEntries(
          Object.entries(formState.errors).filter(([key]) => key !== field)
        );

    const isValid = Object.values(newErrors).every((err) => !err);

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          errors: newErrors,
          isValid,
        }
      }
    };
  }),

  setErrors: (formId: string, errors: Record<string, string | React.ReactNode>) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();
    const isValid = Object.values(errors).every((error) => !error);

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          errors,
          isValid,
        }
      }
    };
  }),

  setTouched: (formId: string, field: string, isTouched: boolean) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          touched: { ...formState.touched, [field]: isTouched },
        }
      }
    };
  }),

  setAllTouched: (formId: string) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    const allTouched = Object.keys(formState.values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          touched: allTouched,
        }
      }
    };
  }),

  resetForm: (formId: string, values = {}) => set((state: FormState) => ({
    forms: {
      ...state.forms,
      [formId]: getDefaultFormState(values)
    }
  })),

  setSubmitting: (formId: string, isSubmitting: boolean) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          isSubmitting,
        }
      }
    };
  }),

  setIsValid: (formId: string, isValid: boolean) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          isValid,
        }
      }
    };
  }),

  incrementSubmitCount: (formId: string) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          submitCount: formState.submitCount + 1,
        }
      }
    };
  }),

  setFieldValidating: (formId: string, field: string, isValidating: boolean) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          validatingFields: { ...formState.validatingFields, [field]: isValidating },
        }
      }
    };
  }),

  validateFieldWithApi: (formId: string, field: string, value: any, rule: ValidationRule) => {
    // Check if rule and apiConfig exist
    if (!rule || !rule.apiConfig) return;

    const {
      url,
      method = "GET",
      debounceMs = 500,
      paramName = "value",
      headers = {},
      successCondition,
    } = rule.apiConfig;

    // Get the current state
    const store = get();
    const formState = store.forms[formId] || getDefaultFormState();

    // Set field as validating
    store.setFieldValidating(formId, field, true);

    // Create a map for this form if it doesn't exist
    if (!debouncedValidations.has(formId)) {
      debouncedValidations.set(formId, new Map());
    }

    const formValidations = debouncedValidations.get(formId)!;

    // Create or get the debounced validation function for this field
    if (!formValidations.has(field)) {
      const debouncedFn = debounce(
        async (formId: string, fieldName: string, fieldValue: any) => {
          try {
            // Prepare request config
            const config = {
              method,
              url,
              headers,
              ...(method === "GET"
                ? { params: { [paramName]: fieldValue } }
                : { data: { [paramName]: fieldValue } }),
            };

            // Make the API request
            const response = await apiClient(config);

            // Check if validation passed
            let isValid = false;

            if (successCondition) {
              // Use the provided success condition
              isValid = successCondition(response.data);
            } else if (response.data.available !== undefined) {
              // Check if the API returns an 'available' property
              isValid = response.data.available === true;
            } else if (response.data.success !== undefined) {
              // Check if the API returns a 'success' property
              isValid = response.data.success === true;
            } else if (response.data.valid !== undefined) {
              // Check if the API returns a 'valid' property
              isValid = response.data.valid === true;
            } else if (response.data.isValid !== undefined) {
              // Check if the API returns an 'isValid' property
              isValid = response.data.isValid === true;
            } else {
              // Default to invalid if no condition is provided and no standard properties found
              isValid = false;
            }

            // Update form state based on validation result
            const store = get();
            if (!isValid) {
              store.setError(formId, fieldName, rule.message);
            } else {
              store.setError(formId, fieldName, null);
            }
          } catch (error) {
            // Handle API error
            console.log("API validation error:", error);
            const store = get();
            store.setError(formId, fieldName, rule.message);
          } finally {
            // Set field as no longer validating
            const store = get();
            store.setFieldValidating(formId, fieldName, false);
          }
        },
        debounceMs
      );

      formValidations.set(field, debouncedFn);
    }

    // Execute the debounced validation
    const debouncedFn = formValidations.get(field);
    if (debouncedFn) {
      debouncedFn(formId, field, value);
    }
  },

    validateField: (
        formId: string,
        fieldName: string,
        value: any,
        rules: ValidationRule[],
        formValues: Record<string, any> = {},
    ) => {
        if (!rules) return null;
        const store = get();
        if(!store) {
            console.log('No Store')
            return null;
        }
        let hasError:boolean = false
        for (const rule of rules) {
            switch (rule.type) {
                case "required":
                    if (value === undefined || value === null || value === "") {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "min":
                    if (typeof value === "number" && value < rule.value) {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "max":
                    if (typeof value === "number" && value > rule.value) {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "minLength":
                    if (typeof value === "string" && value.length < rule.value) {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "maxLength":
                    if (typeof value === "string" && value.length > rule.value) {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "pattern":
                    if (typeof value === "string" && !new RegExp(rule.value).test(value)) {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "email":
                    if (
                        typeof value === "string" &&
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
                    ) {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "url":
                    if (
                        typeof value === "string" &&
                        !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
                            value
                        )
                    ) {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "custom":
                    if (rule.validator && !rule.validator(value, formValues)) {
                        store.setError(formId, fieldName, rule.message);
                        hasError = true;
                        break;
                    }
                    break;
                case "apiValidation":
                    // For API validation, we trigger the validation but also check if there's an existing error
                    if (fieldName) {
                        // Make sure rule and apiConfig exist
                        if (!rule || !rule.apiConfig) {
                            break;
                        }

                        // Use the provided store or get it from the global state
                        const formStore = store || useFormStore.getState();

                        try {
                            // Import the utility function to avoid circular dependencies
                            const { triggerApiValidation } = require('../utils/apiValidation');
                            triggerApiValidation(fieldName, value, rule, formStore);
                        } catch (error) {
                            console.error("Error in API validation:", error);
                        }
                    }
                    break;
            }
            if(hasError) {
                break;
            }
        }
        store.setTouched(formId,fieldName, true);

        return null;
    },

  // Check if any fields are currently being validated
  hasValidatingFields: (formId: string) => {
    const state = get();
    const formState = state.forms[formId] || getDefaultFormState();
    return Object.values(formState.validatingFields).some(
      (isValidating) => isValidating
    );
  },

  // Set edit mode for a form
  setEditMode: (formId: string, isEditMode: boolean) => set((state: FormState) => {
    const formState = state.forms[formId] || getDefaultFormState();

    return {
      forms: {
        ...state.forms,
        [formId]: {
          ...formState,
          isEditMode,
        }
      }
    };
  }),
}));

// Helper function to access the current form state
export const useFormInstance = (formId: string = 'default', initialValues: Record<string, any> = {}) => {
  // Initialize the form in a useEffect hook to avoid the "Cannot update a component while rendering a different component" error
  useEffect(() => {
    // Only initialize the form once on the client side
    if (typeof window !== 'undefined') {
      useFormStore.getState().initForm(formId, initialValues);
    }
  }, [formId, JSON.stringify(initialValues)]);

  // Create a stable reference for the default state
  const defaultStateRef = useRef(getDefaultFormState(initialValues));

  // Use a memoized selector to prevent infinite loops
  const selector = useCallback(
    (state: FormState) => state.forms[formId] || defaultStateRef.current,
    [formId] // We don't need to include initialValues here since we're using a ref
  );

  // Get the form state using the memoized selector
  const formState = useFormStore(selector);

  // Get the actions for this form
  const setValue = useCallback((field: string, value: any) => {
    useFormStore.getState().setValue(formId, field, value);
  }, [formId]);

  const setValues = useCallback((values: Record<string, any>) => {
    useFormStore.getState().setValues(formId, values);
  }, [formId]);

  const setError = useCallback((field: string, error: string | React.ReactNode | null) => {
    useFormStore.getState().setError(formId, field, error);
  }, [formId]);

  const setErrors = useCallback((errors: Record<string, string | React.ReactNode>) => {
    useFormStore.getState().setErrors(formId, errors);
  }, [formId]);

  const setTouched = useCallback((field: string, isTouched: boolean) => {
    useFormStore.getState().setTouched(formId, field, isTouched);
  }, [formId]);

  const setAllTouched = useCallback(() => {
    useFormStore.getState().setAllTouched(formId);
  }, [formId]);

  const resetForm = useCallback((values: Record<string, any> = {}) => {
    useFormStore.getState().resetForm(formId, values);
  }, [formId]);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    useFormStore.getState().setSubmitting(formId, isSubmitting);
  }, [formId]);

  const setIsValid = useCallback((isValid: boolean) => {
    useFormStore.getState().setIsValid(formId, isValid);
  }, [formId]);

  const incrementSubmitCount = useCallback(() => {
    useFormStore.getState().incrementSubmitCount(formId);
  }, [formId]);

  const setFieldValidating = useCallback((field: string, isValidating: boolean) => {
    useFormStore.getState().setFieldValidating(formId, field, isValidating);
  }, [formId]);

  const validateFieldWithApi = useCallback((field: string, value: any, rule: ValidationRule) => {
    useFormStore.getState().validateFieldWithApi(formId, field, value, rule);
  }, [formId]);

  const validateField = useCallback((fieldName: string, value: any, rules: ValidationRule[],formValues: Record<string, any>) => {
    useFormStore.getState().validateField(formId, fieldName, value, rules,formValues);
  }, [formId]);

  const hasValidatingFields = useCallback(() => {
    return useFormStore.getState().hasValidatingFields(formId);
  }, [formId]);

  const setEditMode = useCallback((isEditMode: boolean) => {
    useFormStore.getState().setEditMode(formId, isEditMode);
  }, [formId]);

  return {
    // State
    ...formState,

    // Actions
    setValue,
    setValues,
    setError,
    setErrors,
    setTouched,
    setAllTouched,
    resetForm,
    setSubmitting,
    setIsValid,
    incrementSubmitCount,
    setFieldValidating,
    validateFieldWithApi,
    validateField,
    hasValidatingFields,
    setEditMode
  };
};

