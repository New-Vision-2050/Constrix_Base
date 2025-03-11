
import { useState, useEffect, useCallback } from 'react';
import { FormConfig, ValidationRule } from '../types/formTypes';
import { useFormStore, validateField } from '../store/useFormStore';

export const useFormBuilder = (config: FormConfig) => {
  const formStore = useFormStore();
  const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);
  
  useEffect(() => {
    if (config.initialValues && !initialValuesLoaded) {
      formStore.resetForm(config.initialValues);
      setInitialValuesLoaded(true);
    }
  }, [config.initialValues, formStore, initialValuesLoaded]);
  
  const handleReset = () => {
    formStore.resetForm(config.initialValues);
  };
  
  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
  };
  
  const shouldDisplaySection = useCallback((condition?: (values: Record<string, any>) => boolean) => {
    if (!condition) {
      return true;
    }
    
    return condition(formStore.values);
  }, [formStore.values]);
  
  // Function to handle Laravel validation errors
  const handleLaravelValidationErrors = useCallback((response: any) => {
    if (!config.laravelValidation?.enabled) return false;
    
    const errorsPath = config.laravelValidation.errorsPath || 'errors';
    const laravelErrors = response[errorsPath];
    
    if (!laravelErrors || typeof laravelErrors !== 'object') {
      return false;
    }
    
    const formattedErrors: Record<string, string> = {};
    
    // Laravel typically returns errors as an object with field names as keys
    // and arrays of error messages as values
    Object.entries(laravelErrors).forEach(([key, value]) => {
      // If the value is an array, take the first error message
      if (Array.isArray(value)) {
        formattedErrors[key] = value[0];
      } else if (typeof value === 'string') {
        // If it's already a string, use it directly
        formattedErrors[key] = value;
      }
    });
    
    if (Object.keys(formattedErrors).length > 0) {
      console.log('Laravel validation errors:', formattedErrors);
      formStore.setErrors(formattedErrors);
      formStore.setAllTouched();
      
      if (config.onValidationError) {
        config.onValidationError(formattedErrors);
      }
      return true;
    }
    
    return false;
  }, [config.laravelValidation, config.onValidationError, formStore]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formStore = useFormStore.getState();
    
    // Mark all fields as touched first to display validation errors
    formStore.setAllTouched();
    formStore.incrementSubmitCount();
    
    const formErrors: Record<string, string> = {};
    let hasErrors = false;
    
    console.log('Starting validation process...');
    
    // Validate all fields in visible sections
    config.sections.forEach(section => {
      if (shouldDisplaySection(section.condition)) {
        console.log('Validating section:', section.title);
        
        section.fields.forEach(field => {
          // Skip validation for fields that are conditionally hidden or disabled
          if ((field.condition && !field.condition(formStore.values)) || 
              field.disabled || field.readOnly) {
            return;
          }
          
          const value = formStore.values[field.name];
          console.log(`Validating field: ${field.name}, value:`, value);
          
          if (field.validation && field.validation.length > 0) {
            const error = validateField(value, field.validation, formStore.values);
            
            if (error) {
              console.log(`Validation error for ${field.name}:`, error);
              formErrors[field.name] = error;
              hasErrors = true;
            }
          }
        });
      }
    });
    
    console.log('Validation complete. Errors found:', hasErrors);
    console.log('Error map:', formErrors);
    
    // Update the form state with validation errors
    formStore.setErrors(formErrors);
    
    if (hasErrors) {
      console.log('Form has validation errors, not submitting');
      if (config.onValidationError) {
        config.onValidationError(formErrors);
      }
      return;
    }
    
    console.log('Form is valid, proceeding with submission');
    
    formStore.setSubmitting(true);
    
    try {
      const result = await config.onSubmit(formStore.values);
      
      // Check for Laravel validation errors in the response
      if (result.errors && config.laravelValidation?.enabled) {
        const hasLaravelErrors = handleLaravelValidationErrors({
          errors: result.errors
        });
        
        if (hasLaravelErrors) {
          console.log('Laravel validation errors found in response');
          formStore.setSubmitting(false);
          return;
        }
      }
      
      if (result.success) {
        if (config.resetOnSuccess !== false && config.initialValues) {
          formStore.resetForm(config.initialValues);
        }
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      
      // Try to handle Laravel validation errors from the caught error
      if (config.laravelValidation?.enabled && error.response?.data) {
        const hasLaravelErrors = handleLaravelValidationErrors(error.response.data);
        if (!hasLaravelErrors) {
          // If no Laravel errors were found, check for a standard error message
          const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
          console.error('Error message:', errorMessage);
        }
      }
    } finally {
      formStore.setSubmitting(false);
    }
  };
  
  return {
    values: formStore.values,
    errors: formStore.errors,
    touched: formStore.touched,
    isSubmitting: formStore.isSubmitting,
    isValid: formStore.isValid,
    submitCount: formStore.submitCount,
    setValue: formStore.setValue,
    setValues: formStore.setValues,
    setError: formStore.setError,
    setTouched: formStore.setTouched,
    setAllTouched: formStore.setAllTouched,
    resetForm: formStore.resetForm,
    setSubmitting: formStore.setSubmitting,
    setIsValid: formStore.setIsValid,
    incrementSubmitCount: formStore.incrementSubmitCount,
    handleSubmit,
    handleReset,
    handleCancel,
    shouldDisplaySection,
    handleLaravelValidationErrors,
  };
};
