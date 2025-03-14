import { useState, useCallback, useEffect } from 'react';
import { FormConfig } from '../types/formTypes';

interface UseSheetFormProps {
  config: FormConfig;
  onSuccess?: (values: Record<string, any>) => void;
  onCancel?: () => void;
}

interface UseSheetFormResult {
  isOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  submitSuccess: boolean;
  submitError: string | null;
  setValues: (values: Record<string, any>) => void;
  setValue: (field: string, value: any) => void;
  setTouched: (field: string, isTouched: boolean) => void;
  setAllTouched: () => void;
  resetForm: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleCancel: () => void;
}

export function useSheetForm({ config, onSuccess, onCancel }: UseSheetFormProps): UseSheetFormResult {
  // Sheet state
  const [isOpen, setIsOpen] = useState(false);
  
  // Form state
  const [values, setValues] = useState<Record<string, any>>(config.initialValues || {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset form when config changes
  useEffect(() => {
    if (config.initialValues) {
      setValues(config.initialValues);
    }
  }, [config]);

  // Open and close sheet
  const openSheet = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    // Reset form state when sheet is closed
    if (config.resetOnSuccess) {
      resetForm();
    }
  }, [config.resetOnSuccess]);

  // Form actions
  const setValue = useCallback((field: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const setFieldTouched = useCallback((field: string, isTouched: boolean) => {
    setTouched(prev => ({
      ...prev,
      [field]: isTouched
    }));
  }, []);

  const setAllTouched = useCallback(() => {
    const allTouched: Record<string, boolean> = {};
    
    // Mark all fields as touched
    config.sections.forEach(section => {
      section.fields.forEach(field => {
        allTouched[field.name] = true;
      });
    });
    
    setTouched(allTouched);
  }, [config.sections]);

  const resetForm = useCallback(() => {
    setValues(config.initialValues || {});
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitSuccess(false);
    setSubmitError(null);
  }, [config.initialValues]);

  // Validate all form fields
  const validateAllFields = useCallback(() => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Iterate through all sections and fields
    config.sections.forEach(section => {
      // Skip sections that don't meet their condition
      if (section.condition && !section.condition(values)) {
        return;
      }
      
      section.fields.forEach(field => {
        // Skip fields that don't meet their condition
        if (field.condition && !field.condition(values)) {
          return;
        }
        
        // Skip fields that are hidden or disabled
        if (field.hidden || field.disabled) {
          return;
        }
        
        // Check required fields
        if (field.required && (!values[field.name] || values[field.name] === '')) {
          newErrors[field.name] = `${field.label} is required`;
          isValid = false;
        }
        
        // Check validation rules
        if (field.validation && field.validation.length > 0) {
          for (const rule of field.validation) {
            const value = values[field.name];
            
            switch (rule.type) {
              case 'required':
                if (value === undefined || value === null || value === '') {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              case 'minLength':
                if (typeof value === 'string' && value.length < rule.value) {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              case 'maxLength':
                if (typeof value === 'string' && value.length > rule.value) {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              case 'pattern':
                if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              case 'email':
                if (typeof value === 'string' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  newErrors[field.name] = rule.message;
                  isValid = false;
                }
                break;
              // Add other validation types as needed
            }
            
            // Break the loop if we already found an error for this field
            if (newErrors[field.name]) {
              break;
            }
          }
        }
      });
    });
    
    // Update form state with errors
    setErrors(newErrors);
    
    return isValid;
  }, [config.sections, values]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Stop event propagation to prevent rerendering
    
    // Reset submission state
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
    // Mark all fields as touched
    setAllTouched();
    
    // Validate all fields before submission
    const isValid = validateAllFields();
    
    // If form is not valid, stop submission
    if (!isValid) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Call the onSubmit handler from config
      const result = await config.onSubmit(values);
      
      if (result.success) {
        setSubmitSuccess(true);
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(values);
        }
        
        // Close the sheet after successful submission
        setTimeout(() => {
          closeSheet();
        }, 1000);
        
        // Reset form if configured to do so
        if (config.resetOnSuccess) {
          resetForm();
        }
      } else {
        // Handle API error message
        setSubmitError(result.message || 'Form submission failed');
        
        // Handle Laravel validation errors if enabled
        if (config.laravelValidation?.enabled && result.errors) {
          const formattedErrors: Record<string, string> = {};
          
          // Convert Laravel validation errors to form errors
          Object.entries(result.errors).forEach(([field, messages]) => {
            formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages;
          });
          
          // Set form errors
          setErrors(formattedErrors);
          
          // Mark fields with errors as touched
          Object.keys(formattedErrors).forEach(field => {
            setFieldTouched(field, true);
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    config, 
    values, 
    validateAllFields, 
    setAllTouched, 
    closeSheet, 
    resetForm, 
    onSuccess, 
    setFieldTouched
  ]);

  // Handle form cancel
  const handleCancel = useCallback(() => {
    closeSheet();
    
    // Call onCancel callback if provided
    if (onCancel) {
      onCancel();
    } else if (config.onCancel) {
      config.onCancel();
    }
  }, [closeSheet, onCancel, config.onCancel]);

  return {
    isOpen,
    openSheet,
    closeSheet,
    values,
    errors,
    touched,
    isSubmitting,
    submitSuccess,
    submitError,
    setValues,
    setValue,
    setTouched: setFieldTouched,
    setAllTouched,
    resetForm,
    handleSubmit,
    handleCancel
  };
}