import { create } from 'zustand';
import { ValidationRule } from '../types/formTypes';

interface FormState {
  // Form values and state
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  submitCount: number;
  
  // Form actions
  setValue: (field: string, value: any) => void;
  setValues: (values: Record<string, any>) => void;
  setError: (field: string, error: string | null) => void;
  setErrors: (errors: Record<string, string>) => void;
  setTouched: (field: string, isTouched: boolean) => void;
  setAllTouched: () => void;
  resetForm: (values?: Record<string, any>) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setIsValid: (isValid: boolean) => void;
  incrementSubmitCount: () => void;
}

// Create a more efficient store structure
export const useFormStore = create<FormState>((set, get) => ({
  // Initial state
  values: {},
  errors: {},
  touched: {},
  isSubmitting: false,
  isValid: true,
  submitCount: 0,
  
  // Actions
  setValue: (field, value) => {
    // Get the current state
    const currentState = get();
    
    // Only update if the value has actually changed
    if (currentState.values[field] === value) {
      return;
    }
    
    // Update the value
    set((state) => ({
      values: { ...state.values, [field]: value }
    }), false); // Use false for shallow merge to prevent unnecessary rerenders
  },
  
  setValues: (values) => set((state) => ({
    values: { ...state.values, ...values }
  })),
  
  setError: (field, error) => set((state) => ({
    errors: error
      ? { ...state.errors, [field]: error }
      : Object.fromEntries(Object.entries(state.errors).filter(([key]) => key !== field)),
    isValid: error ? false : Object.values({
      ...state.errors,
      [field]: null
    }).every(err => !err)
  })),
  
  setErrors: (errors) => set(() => ({
    errors,
    isValid: Object.values(errors).every(error => !error)
  })),
  
  setTouched: (field, isTouched) => set((state) => ({
    touched: { ...state.touched, [field]: isTouched }
  })),
  
  setAllTouched: () => set((state) => {
    const allTouched = Object.keys(state.values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    return { touched: allTouched };
  }),
  
  resetForm: (values = {}) => set({
    values,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true
  }),
  
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  
  setIsValid: (isValid) => set({ isValid }),
  
  incrementSubmitCount: () => set((state) => ({ 
    submitCount: state.submitCount + 1 
  }))
}));

// Helper function to validate fields based on validation rules
export const validateField = (
  value: any,
  rules?: ValidationRule[],
  formValues: Record<string, any> = {}
): string | null => {
  if (!rules) return null;
  
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (value === undefined || value === null || value === '') {
          return rule.message;
        }
        break;
      case 'min':
        if (typeof value === 'number' && value < rule.value) {
          return rule.message;
        }
        break;
      case 'max':
        if (typeof value === 'number' && value > rule.value) {
          return rule.message;
        }
        break;
      case 'minLength':
        if (typeof value === 'string' && value.length < rule.value) {
          return rule.message;
        }
        break;
      case 'maxLength':
        if (typeof value === 'string' && value.length > rule.value) {
          return rule.message;
        }
        break;
      case 'pattern':
        if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
          return rule.message;
        }
        break;
      case 'email':
        if (typeof value === 'string' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          return rule.message;
        }
        break;
      case 'url':
        if (typeof value === 'string' && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(value)) {
          return rule.message;
        }
        break;
      case 'custom':
        if (rule.validator && !rule.validator(value, formValues)) {
          return rule.message;
        }
        break;
    }
  }
  
  return null;
};