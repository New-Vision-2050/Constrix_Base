import { useCallback } from 'react';
import { DynamicRowFieldConfig } from '../../../types/formTypes';
import { validateField } from '../../../hooks/useFormStore';
import { RowData } from './types';

/**
 * Custom hook for row validation
 */
export const useRowValidation = (
  fields: DynamicRowFieldConfig[],
  formInstance: any,
  fieldName: string,
  fieldLabel: string,
  minRows?: number,
  required?: boolean,
  onBlur?: () => void
) => {
  // Validate a single row
  const validateRow = useCallback((rowIndex: number, rowData: RowData, rows: RowData[]) => {
    const rowFieldErrors: Record<string, string | React.ReactNode> = {};
    let isValid = true;
    
    // Validate each field in the row
    fields.forEach((fieldConfig) => {
      // Skip fields that don't meet their condition
      if (fieldConfig.condition && !fieldConfig.condition(rowData)) {
        return;
      }
      
      // Skip fields that are hidden or disabled
      if (fieldConfig.hidden || fieldConfig.disabled) {
        return;
      }
      
      // Get the field value
      const fieldValue = rowData[fieldConfig.name];
      
      // Check required fields
      if (fieldConfig.required && (fieldValue === undefined || fieldValue === null || fieldValue === "")) {
        rowFieldErrors[fieldConfig.name] = `${fieldConfig.label} is required`;
        isValid = false;
      }
      
      // Check validation rules
      if (fieldConfig.validation && fieldConfig.validation.length > 0) {
        const error = validateField(fieldValue, fieldConfig.validation, rowData, fieldConfig.name);
        if (error) {
          rowFieldErrors[fieldConfig.name] = error;
          isValid = false;
        }
      }
    });
    
    return { isValid, rowFieldErrors };
  }, [fields]);
  
  // Basic validation for form submission
  const validateBasicRequirements = useCallback((rows: RowData[]) => {
    let isValid = true;
    
    // Check if the field is required and empty
    if (required && (!rows || rows.length === 0)) {
      isValid = false;
      formInstance.setError(fieldName, `${fieldLabel} is required`);
    }
    // Check if we have fewer rows than the minimum required
    else if (minRows && rows.length < minRows) {
      isValid = false;
      formInstance.setError(fieldName, `At least ${minRows} rows are required`);
    } else {
      // Clear any errors for this field
      formInstance.setError(fieldName, null);
    }
    
    if (!isValid && onBlur) {
      onBlur();
    }
    
    return isValid;
  }, [required, minRows, formInstance, fieldName, fieldLabel, onBlur]);
  
  return { validateRow, validateBasicRequirements };
};