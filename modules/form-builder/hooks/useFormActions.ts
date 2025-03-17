"use client";
import { useCallback } from "react";
import { ValidationRule } from "../types/formTypes";

interface UseFormActionsProps {
  setValue: (field: string, value: any) => void;
  setValues: (values: Record<string, any>) => void;
  setError: (field: string, error: string | null) => void;
  setErrors: (errors: Record<string, string>) => void;
  setTouched: (field: string, isTouched: boolean) => void;
  setAllTouched: () => void;
  resetForm: (values?: Record<string, any>) => void;
  validateFieldWithApi?: (field: string, value: any, rule: ValidationRule) => void;
}

/**
 * Hook to provide form action handlers
 * This centralizes common form actions and provides a consistent API
 */
export const useFormActions = ({
  setValue,
  setValues,
  setError,
  setErrors,
  setTouched,
  setAllTouched,
  resetForm,
  validateFieldWithApi,
}: UseFormActionsProps) => {
  /**
   * Handle field change
   * @param field The field name
   * @param value The new value
   * @param validation Optional validation rules to apply
   */
  const handleFieldChange = useCallback(
    (field: string, value: any, validation?: ValidationRule[]) => {
      // Update the field value
      setValue(field, value);
      
      // Mark the field as touched
      setTouched(field, true);
      
      // Clear any existing error for this field
      setError(field, null);
      
      // If validation rules are provided, apply them
      if (validation && validation.length > 0) {
        for (const rule of validation) {
          // Handle different validation types
          switch (rule.type) {
            case "required":
              if (value === undefined || value === null || value === "") {
                setError(field, rule.message);
                return;
              }
              break;
            case "minLength":
              if (typeof value === "string" && value.length < rule.value) {
                setError(field, rule.message);
                return;
              }
              break;
            case "maxLength":
              if (typeof value === "string" && value.length > rule.value) {
                setError(field, rule.message);
                return;
              }
              break;
            case "pattern":
              if (
                typeof value === "string" &&
                !new RegExp(rule.value).test(value)
              ) {
                setError(field, rule.message);
                return;
              }
              break;
            case "email":
              if (
                typeof value === "string" &&
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
              ) {
                setError(field, rule.message);
                return;
              }
              break;
            case "apiValidation":
              // If API validation is configured, trigger it
              if (validateFieldWithApi && rule.apiConfig) {
                validateFieldWithApi(field, value, rule);
              }
              break;
          }
        }
      }
    },
    [setValue, setTouched, setError, validateFieldWithApi]
  );

  /**
   * Handle form reset
   * @param initialValues Optional initial values to set when resetting
   */
  const handleFormReset = useCallback(
    (initialValues: Record<string, any> = {}) => {
      resetForm(initialValues);
    },
    [resetForm]
  );

  /**
   * Handle form submission preparation
   * This marks all fields as touched and returns whether the form is valid
   * @param errors Current form errors
   * @returns Whether the form is valid for submission
   */
  const handleSubmitPrep = useCallback(
    (errors: Record<string, string>) => {
      // Mark all fields as touched
      setAllTouched();
      
      // Check if there are any errors
      const hasErrors = Object.values(errors).some(error => !!error);
      
      return !hasErrors;
    },
    [setAllTouched]
  );

  /**
   * Handle bulk value updates
   * @param newValues The values to update
   * @param validate Whether to validate the new values
   */
  const handleBulkUpdate = useCallback(
    (newValues: Record<string, any>, validate = false) => {
      // Update the values
      setValues(newValues);
      
      // If validation is requested, mark all fields as touched to trigger validation
      if (validate) {
        setAllTouched();
      }
    },
    [setValues, setAllTouched]
  );

  return {
    handleFieldChange,
    handleFormReset,
    handleSubmitPrep,
    handleBulkUpdate,
  };
};