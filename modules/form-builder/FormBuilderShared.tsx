import React, { useEffect, useState } from 'react';
import { FormConfig } from './types/formTypesShared';
import { useFormStore } from './store/useFormStore';
import FormFieldSharedSimple from './FormFieldSharedSimple';
import { Button } from '@/modules/table/components/ui/button';

interface FormBuilderProps {
  config: FormConfig;
  onSuccess?: (values: Record<string, any>) => void;
}

const FormBuilderShared: React.FC<FormBuilderProps> = ({ config, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Get form state and actions
  const { values, errors, touched, resetForm, setErrors, setValues, setTouched } = useFormStore();

  // Initialize form with initial values from config
  useEffect(() => {
    if (config.initialValues) {
      setValues(config.initialValues);
    }
    
    // Reset form state when config changes
    return () => {
      resetForm();
    };
  }, [config, resetForm, setValues]);

  // Validate all form fields
  const validateAllFields = () => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
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
          newTouched[field.name] = true;
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
                  newTouched[field.name] = true;
                  isValid = false;
                }
                break;
              case 'minLength':
                if (typeof value === 'string' && value.length < rule.value) {
                  newErrors[field.name] = rule.message;
                  newTouched[field.name] = true;
                  isValid = false;
                }
                break;
              case 'maxLength':
                if (typeof value === 'string' && value.length > rule.value) {
                  newErrors[field.name] = rule.message;
                  newTouched[field.name] = true;
                  isValid = false;
                }
                break;
              case 'pattern':
                if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
                  newErrors[field.name] = rule.message;
                  newTouched[field.name] = true;
                  isValid = false;
                }
                break;
              case 'email':
                if (typeof value === 'string' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  newErrors[field.name] = rule.message;
                  newTouched[field.name] = true;
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
    
    // Update form state with errors and touched fields
    if (!isValid) {
      setErrors(newErrors);
      Object.keys(newTouched).forEach(field => {
        setTouched(field, true);
      });
    }
    
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset submission state
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    
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
            setTouched(field, true);
          });
          
          // Call onValidationError callback if provided
          if (config.onValidationError) {
            config.onValidationError(formattedErrors);
          }
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form reset
  const handleReset = () => {
    resetForm();
  };

  // Handle form cancel
  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel();
    }
  };

  return (
    <div className="form-builder">
      {config.title && <h2 className="text-2xl font-bold mb-4">{config.title}</h2>}
      {config.description && <p className="text-gray-600 mb-6">{config.description}</p>}
      
      <form onSubmit={handleSubmit} className={config.className}>
        {/* Render form sections */}
        {config.sections.map((section, sectionIndex) => {
          // Check section condition if provided
          if (section.condition && !section.condition(values)) {
            return null;
          }
          
          return (
            <div key={sectionIndex} className={`mb-8 ${section.className || ''}`}>
              {section.title && <h3 className="text-xl font-semibold mb-4">{section.title}</h3>}
              {section.description && <p className="text-gray-500 mb-4">{section.description}</p>}
              
              <div className={`grid gap-4 ${section.columns ? `grid-cols-${section.columns}` : 'grid-cols-1'}`}>
                {/* Render fields in this section */}
                {section.fields.map((field) => {
                  // Check field condition if provided
                  if (field.condition && !field.condition(values)) {
                    return null;
                  }
                  
                  return (
                    <FormFieldSharedSimple
                      key={field.name}
                      field={field}
                      value={values[field.name]}
                      error={errors[field.name]}
                      touched={touched[field.name]}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Form submission error */}
        {submitError && (
          <div className="bg-destructive/10 text-destructive p-3 rounded mb-4">
            {submitError}
          </div>
        )}
        
        {/* Form submission success */}
        {submitSuccess && (
          <div className="bg-green-100 text-green-800 p-3 rounded mb-4">
            Form submitted successfully!
          </div>
        )}
        
        {/* Form buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting && config.showSubmitLoader ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              config.submitButtonText || 'Submit'
            )}
          </Button>
          
          {config.showReset && (
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              disabled={isSubmitting}
            >
              {config.resetButtonText || 'Reset'}
            </Button>
          )}
          
          {config.cancelButtonText && (
            <Button
              type="button"
              onClick={handleCancel}
              variant="ghost"
              disabled={isSubmitting}
            >
              {config.cancelButtonText}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FormBuilderShared;