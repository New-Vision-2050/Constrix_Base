"use client";
import { useEffect } from "react";
import { FormConfig, ValidationRule } from "../types/formTypes";
import { useFormInstance, useFormStore } from "./useFormStore";
import { useFormActions } from "./useFormActions";
import { useFormInitialization } from "./useFormInitialization";

export interface UseFormDataProps {
  config: FormConfig;
  formId?: string;
  onSuccess?: (values: Record<string, any>) => void;
  onError?: (error: string) => void;
}

/**
 * Main hook for using forms with the isolated pattern
 * This combines form store, actions, and initialization
 */
export const useFormData = ({
  config,
  formId = 'default-form',
  onSuccess,
  onError,
}: UseFormDataProps) => {
  // Set the active form ID
  const setFormId = useFormStore((state) => state.setFormId);
  
  // Set the active form ID only once
  useEffect(() => {
    setFormId(formId);
    
    // Return cleanup function
    return () => {
      // Don't reset the form on unmount to allow for data persistence
    };
  }, [formId, setFormId]);
  
  // Get state and actions from the form instance
  const formInstance = useFormInstance(formId, config.initialValues || {});
  
  const {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    
    setValue,
    setValues,
    setError,
    setErrors,
    setTouched,
    setAllTouched,
    resetForm,
    setSubmitting,
    setIsValid,
    validateFieldWithApi,
    hasValidatingFields,
  } = formInstance;
  
  // Initialize form state
  const { getVisibleFields, isFieldRequired } = useFormInitialization({
    config,
    setValues,
    setErrors,
    setIsValid,
  });
  
  // Get form action handlers
  const {
    handleFieldChange,
    handleFormReset,
    handleSubmitPrep,
    handleBulkUpdate,
  } = useFormActions({
    setValue,
    setValues,
    setError,
    setErrors,
    setTouched,
    setAllTouched,
    resetForm,
    validateFieldWithApi,
  });
  
  // Handle form submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Prepare for submission
    setSubmitting(true);
    
    // Mark all fields as touched to trigger validation
    setAllTouched();
    
    // Check if form is valid
    if (!isValid) {
      setSubmitting(false);
      if (onError) {
        onError("Form has validation errors");
      }
      return { success: false, message: "Form has validation errors" };
    }
    
    // Check if any fields are being validated
    if (hasValidatingFields()) {
      setSubmitting(false);
      if (onError) {
        onError("Please wait for field validation to complete");
      }
      return { success: false, message: "Please wait for field validation to complete" };
    }
    
    try {
      // Call the onSubmit handler from config
      if (config.onSubmit) {
        const result = await config.onSubmit(values);
        
        // Handle success
        if (result.success) {
          if (onSuccess) {
            onSuccess(values);
          }
          
          // Reset form if configured to do so
          if (config.resetOnSuccess) {
            resetForm();
          }
        } else {
          // Handle API error
          if (onError) {
            onError(result.message || "Form submission failed");
          }
          
          // Handle validation errors if any
          if (result.errors) {
            const formattedErrors: Record<string, string> = {};
            
            // Convert validation errors to form errors
            Object.entries(result.errors).forEach(([field, messages]) => {
              formattedErrors[field] = Array.isArray(messages)
                ? messages[0]
                : messages as string;
            });
            
            // Set form errors
            setErrors(formattedErrors);
            
            // Mark fields with errors as touched
            Object.keys(formattedErrors).forEach((field) => {
              setTouched(field, true);
            });
          }
        }
        
        return result;
      }
      
      // Default success response if no onSubmit handler is provided
      if (onSuccess) {
        onSuccess(values);
      }
      
      return { success: true, message: "Form submitted successfully" };
    } catch (error) {
      console.error("Form submission error:", error);
      
      if (onError) {
        onError("An unexpected error occurred");
      }
      
      return { success: false, message: "An unexpected error occurred" };
    } finally {
      setSubmitting(false);
    }
  };
  
  // Validate a field with the given rules
  const validateField = (field: string, value: any, rules?: ValidationRule[]) => {
    if (!rules || rules.length === 0) return null;
    
    for (const rule of rules) {
      switch (rule.type) {
        case "required":
          if (value === undefined || value === null || value === "") {
            return rule.message;
          }
          break;
        case "minLength":
          if (typeof value === "string" && value.length < rule.value) {
            return rule.message;
          }
          break;
        case "maxLength":
          if (typeof value === "string" && value.length > rule.value) {
            return rule.message;
          }
          break;
        case "pattern":
          if (
            typeof value === "string" &&
            !new RegExp(rule.value).test(value)
          ) {
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
        case "apiValidation":
          // For API validation, trigger it and return null
          // The validation will update the form state asynchronously
          if (validateFieldWithApi && rule.apiConfig) {
            validateFieldWithApi(field, value, rule);
          }
          break;
      }
    }
    
    return null;
  };
  
  return {
    // State
    formId,
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    
    // Field helpers
    getVisibleFields,
    isFieldRequired,
    
    // Actions
    setValue,
    setValues,
    setError,
    setErrors,
    setTouched,
    setAllTouched,
    resetForm,
    
    // Handlers
    handleFieldChange,
    handleFormReset,
    handleSubmit,
    handleBulkUpdate,
    validateField,
    hasValidatingFields,
  };
};