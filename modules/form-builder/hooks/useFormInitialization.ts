"use client";
import { useEffect } from "react";
import { FieldConfig, FormConfig } from "../types/formTypes";

interface UseFormInitializationProps {
  config: FormConfig;
  setValues: (values: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  setIsValid: (isValid: boolean) => void;
}

/**
 * Hook to initialize a form with the provided configuration
 * This handles setting up initial values, validation, and other form state
 */
export const useFormInitialization = ({
  config,
  setValues,
  setErrors,
  setIsValid,
}: UseFormInitializationProps) => {
  // Initialize form state when the config changes
  useEffect(() => {
    // Set initial values
    if (config.initialValues) {
      setValues(config.initialValues);
    }

    // Initialize with no errors
    setErrors({});
    
    // Initialize as valid
    setIsValid(true);
    
    // Return cleanup function
    return () => {
      // Cleanup logic if needed
    };
  }, [config, setValues, setErrors, setIsValid]);

  // Return any values or functions that might be useful to the consumer
  return {
    // Helper function to get visible fields based on conditions
    getVisibleFields: (values: Record<string, any>): FieldConfig[] => {
      const visibleFields: FieldConfig[] = [];
      
      config.sections.forEach((section) => {
        // Skip sections that don't meet their condition
        if (section.condition && !section.condition(values)) {
          return;
        }
        
        section.fields.forEach((field) => {
          // Skip fields that don't meet their condition
          if (field.condition && !field.condition(values)) {
            return;
          }
          
          // Skip fields that are explicitly hidden
          if (field.hidden) {
            return;
          }
          
          visibleFields.push(field);
        });
      });
      
      return visibleFields;
    },
    
    // Helper function to check if a field is required
    isFieldRequired: (fieldName: string): boolean => {
      for (const section of config.sections) {
        for (const field of section.fields) {
          if (field.name === fieldName) {
            return field.required || false;
          }
        }
      }
      return false;
    }
  };
};