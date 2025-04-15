import { create, StateCreator } from "zustand"; // Import StateCreator
import { immer } from 'zustand/middleware/immer'; // Correct import path for Immer middleware
import { ValidationRule } from "../types/formTypes";
import React, { useEffect, useMemo, useCallback, useRef } from "react";
// Import utility from apiValidation
import { triggerApiValidation, clearDebouncedValidators, hasApiValidation } from '../utils/apiValidation';

// Debounced validation functions are now managed within apiValidation.ts

// Define the state for a single form instance
interface FormInstanceState {
  values: Record<string, any>;
  errors: Record<string, string | React.ReactNode>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
  validatingFields: Record<string, boolean>;
  isEditMode?: boolean;
}

// Define the global store state and actions
// Note: Separating actions interface helps with type inference with Immer
interface FormState {
  forms: Record<string, FormInstanceState>;
}
interface FormActions {
  initForm: (formId: string, initialValues?: Record<string, any>) => void;
  getValue: (formId: string, field: string) => any;
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
  validateFieldWithApi: (formId: string, field: string, value: any, rule: ValidationRule) => void;
  hasValidatingFields: (formId: string) => boolean;
  setEditMode: (formId: string, isEditMode: boolean) => void;
  removeForm: (formId: string) => void;
}

// Default state for a new form instance
const getDefaultFormState = (initialValues: Record<string, any> = {}): FormInstanceState => ({
  values: initialValues,
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true, // Assume valid initially until first validation
  submitCount: 0,
  validatingFields: {},
  isEditMode: false,
});

// Create the store using Immer middleware
export const useFormStore = create<FormState & FormActions>()(
  immer((set, get) => ({
    // Initial state
    forms: {},

    // Initialize a new form instance if it doesn't exist
    initForm: (formId: string, initialValues = {}) => set((state) => {
      if (!state.forms[formId]) {
        state.forms[formId] = getDefaultFormState(initialValues);
      }
    }),

    // Actions for specific form instances
    getValue: (formId: string, field: string) => {
      const state = get();
      return state.forms[formId]?.values[field];
    },

    setValue: (formId: string, field: string, value: any) => set((state) => {
      const formState = state.forms[formId];
      if (formState && formState.values[field] !== value) {
        formState.values[field] = value;
      }
    }),

    setValues: (formId: string, values: Record<string, any>) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        Object.assign(formState.values, values);
      }
    }),

    setError: (formId: string, field: string, error: string | React.ReactNode | null) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        if (error) {
          formState.errors[field] = error;
        } else {
          delete formState.errors[field];
        }
        formState.isValid = Object.values(formState.errors).every((err) => !err);
      }
    }),

    setErrors: (formId: string, errors: Record<string, string | React.ReactNode>) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        formState.errors = errors;
        formState.isValid = Object.values(errors).every((error) => !error);
      }
    }),

    setTouched: (formId: string, field: string, isTouched: boolean) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        formState.touched[field] = isTouched;
      }
    }),

    setAllTouched: (formId: string) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        Object.keys(formState.values).forEach(key => {
          formState.touched[key] = true;
        });
      }
    }),

    resetForm: (formId: string, values = {}) => set((state) => {
      if (state.forms[formId]) {
          state.forms[formId] = getDefaultFormState(values);
      } else {
          state.forms[formId] = getDefaultFormState(values);
      }
    }),

    setSubmitting: (formId: string, isSubmitting: boolean) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        formState.isSubmitting = isSubmitting;
      }
    }),

    setIsValid: (formId: string, isValid: boolean) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        formState.isValid = isValid;
      }
    }),

    incrementSubmitCount: (formId: string) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        formState.submitCount++;
      }
    }),

    setFieldValidating: (formId: string, field: string, isValidating: boolean) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        if (isValidating) {
          formState.validatingFields[field] = true;
        } else {
          delete formState.validatingFields[field];
        }
      }
    }),

    validateFieldWithApi: (formId: string, field: string, value: any, rule: ValidationRule) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        formState.validatingFields[field] = true;
      }
      // Actual API call triggered separately via triggerApiValidation utility
    }),

    hasValidatingFields: (formId: string) => {
      const state = get();
      const formState = state.forms[formId];
      return !!formState && Object.values(formState.validatingFields).some(isValidating => isValidating);
    },

    setEditMode: (formId: string, isEditMode: boolean) => set((state) => {
      const formState = state.forms[formId];
      if (formState) {
        formState.isEditMode = isEditMode;
      }
    }),

    removeForm: (formId: string) => set((state) => {
      delete state.forms[formId];
      clearDebouncedValidators(formId);
    }),
  })) // End of immer middleware wrapper
); // End of create

// Helper hook to interact with a specific form instance
export const useFormInstance = (formId: string = 'default', initialValues: Record<string, any> = {}) => {
  useEffect(() => {
    useFormStore.getState().initForm(formId, initialValues);
    return () => {
      useFormStore.getState().removeForm(formId);
    };
  // The effect itself only depends on formId for setup/teardown.
  // initForm uses the initialValues passed at the time of the effect run.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formId]); // Re-run only if formId changes

  // Memoize the default state to prevent selector returning new reference unnecessarily
  const defaultFormState = useMemo(() => getDefaultFormState(initialValues), [initialValues]);

  const selector = useCallback(
    (state: FormState & FormActions) => state.forms[formId] || defaultFormState,
    // Now depends on the stable defaultFormState reference
    [formId, defaultFormState]
  );

  const formState = useFormStore(selector);

  // Memoize actions to prevent unnecessary re-renders
  const actions = useMemo(() => ({
    setValue: (field: string, value: any) => {
      useFormStore.getState().setValue(formId, field, value);
    },
    setValues: (values: Record<string, any>) => {
      useFormStore.getState().setValues(formId, values);
    },
    setError: (field: string, error: string | React.ReactNode | null) => {
      useFormStore.getState().setError(formId, field, error);
    },
    setErrors: (errors: Record<string, string | React.ReactNode>) => {
      useFormStore.getState().setErrors(formId, errors);
    },
    setTouched: (field: string, isTouched: boolean) => {
      useFormStore.getState().setTouched(formId, field, isTouched);
    },
    setAllTouched: () => {
      useFormStore.getState().setAllTouched(formId);
    },
    resetForm: (values: Record<string, any> = {}) => {
      useFormStore.getState().resetForm(formId, values);
    },
    setSubmitting: (isSubmitting: boolean) => {
      useFormStore.getState().setSubmitting(formId, isSubmitting);
    },
    setIsValid: (isValid: boolean) => {
      useFormStore.getState().setIsValid(formId, isValid);
    },
    incrementSubmitCount: () => {
      useFormStore.getState().incrementSubmitCount(formId);
    },
    setFieldValidating: (field: string, isValidating: boolean) => {
      useFormStore.getState().setFieldValidating(formId, field, isValidating);
    },
    validateFieldWithApi: (field: string, value: any, rule: ValidationRule) => {
      triggerApiValidation(formId, field, value, rule, useFormStore.getState());
    },
    hasValidatingFields: () => {
      return useFormStore.getState().hasValidatingFields(formId);
    },
    setEditMode: (isEditMode: boolean) => {
      useFormStore.getState().setEditMode(formId, isEditMode);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [formId]); // Actions depend only on formId

  return {
    // State
    ...formState,

    // Actions
    ...actions
  };
};

// Helper function to validate fields based on validation rules
export const validateField = (
  value: any,
  rules?: ValidationRule[],
  formValues: Record<string, any> = {},
  fieldName?: string,
  store?: FormState & FormActions, // Use the combined type
  formId?: string
): string | React.ReactNode | null => {
  if (!rules) return null;

  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (value === undefined || value === null || value === "") {
          return rule.message;
        }
        break;
      case "min":
        if (typeof value === "number" && rule.value !== undefined && value < rule.value) {
          return rule.message;
        }
        break;
      case "max":
        if (typeof value === "number" && rule.value !== undefined && value > rule.value) {
          return rule.message;
        }
        break;
      case "minLength":
        if (typeof value === "string" && rule.value !== undefined && value.length < rule.value) {
          return rule.message;
        }
        break;
      case "maxLength":
        if (typeof value === "string" && rule.value !== undefined && value.length > rule.value) {
          return rule.message;
        }
        break;
      case "pattern":
        if (typeof value === "string" && rule.value && !new RegExp(rule.value).test(value)) {
          return rule.message;
        }
        break;
      case "email":
        if (
          typeof value === "string" &&
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
        ) {
          return rule.message;
        }
        break;
      case "url":
        if (
          typeof value === "string" &&
          !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
            value
          )
        ) {
          return rule.message;
        }
        break;
      case "custom":
        if (rule.validator && !rule.validator(value, formValues)) {
          return rule.message;
        }
        break;
      case "apiValidation":
        if (fieldName && formId) {
          const formStore = store || useFormStore.getState();
          const activeForm = formStore.forms[formId];
          if (activeForm?.errors?.[fieldName]) {
            return activeForm.errors[fieldName];
          }
          return null;
        }
        break;
    }
  }

  return null; // No validation errors found
};
