import React, { memo, useCallback, useEffect } from 'react'; // Added useEffect
import { Textarea } from '@/modules/table/components/ui/textarea';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { useFormInstance, validateField, useFormStore } from '../../hooks/useFormStore';
import { hasApiValidation, triggerApiValidation } from '../../utils/apiValidation'; // Import API validation utils

interface TextareaFieldProps {
  field: FieldConfig;
  value: string;
  error?: string | React.ReactNode; // Error from external validation (e.g., RHF)
  touched?: boolean; // Touched state from external validation
  onChange: (value: string) => void;
  onBlur: () => void; // Original onBlur prop (likely just sets touched)
  formId?: string;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  field,
  value,
  error, // External error
  touched, // External touched state
  onChange,
  onBlur, // Original onBlur prop
  formId = 'default',
}) => {
  // Get form instance actions and specific state slices needed
  const {
    setError: setStoreError,
    values: formValues,
    errors: storeErrors,
    validateFieldWithApi: triggerApiValidationAction // Get action for API validation
  } = useFormInstance(formId);

  // Check for errors from both external source and internal store
  const combinedError = error || storeErrors?.[field.name]; // Prioritize external error if present
  const showError = !!combinedError && touched; // Show error only if touched

  // Check if this field has API validation rule (unlikely for textarea, but for consistency)
  const hasApiValRule = field.validation ? hasApiValidation(field.validation) : false;

  // Determine validation mode: Use explicit config, or default based on API validation presence
  const validateMode = field.validateOn || (hasApiValRule ? 'change' : 'blur');

  // Clear store error when value becomes empty (optional, depends on desired UX)
   useEffect(() => {
    if (storeErrors?.[field.name] && (!value || value === "")) {
      setStoreError(field.name, null);
    }
  }, [field.name, value, storeErrors, setStoreError]);

  // Centralized validation function
  const runValidation = useCallback((currentValue: string) => {
    const syncError = validateField(currentValue, field.validation, formValues, field.name, useFormStore.getState(), formId);
    setStoreError(field.name, syncError);

    // Trigger API validation if sync passes and rule exists
    if (!syncError) {
      const apiRule = field.validation?.find(rule => rule.type === 'apiValidation');
      if (apiRule) {
        triggerApiValidationAction(field.name, currentValue, apiRule);
      }
    }
  }, [field, formValues, formId, setStoreError, triggerApiValidationAction]);


  // Handle change event
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue); // Update the value in the parent/store

    if (validateMode === 'change') {
      runValidation(newValue);
    } else {
      // Clear errors immediately if field becomes empty when validating on blur/submit
      if (storeErrors?.[field.name] && newValue === "") {
         setStoreError(field.name, null);
      }
    }
  }, [onChange, validateMode, runValidation, field.name, storeErrors, setStoreError]);

  // Handle blur event
  const handleBlur = useCallback(() => {
    onBlur(); // Call original onBlur (sets touched)
    if (validateMode === 'blur') {
      runValidation(value); // Validate current value on blur
    }
  }, [onBlur, validateMode, runValidation, value]);


  return (
    <Textarea
      id={field.name}
      name={field.name}
      value={value || ''}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readOnly}
      className={cn(
        field.className,
        showError ? 'border-destructive' : '', // Use combined error and touched state
        field.width ? field.width : 'w-full'
      )}
      onChange={handleChange} // Use the new handler
      onBlur={handleBlur} // Use the new handler
    />
  );
};

export default memo(TextareaField);