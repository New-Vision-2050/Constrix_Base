import React, { useCallback, memo } from 'react';
import { FieldConfig } from '../types/formTypes';
import { Label } from '@/modules/table/components/ui/label';
import TextField from './fields/TextField';
import TextareaField from './fields/TextareaField';
import CheckboxField from './fields/CheckboxField';
import RadioField from './fields/RadioField';
import MultiSelectField from './fields/MultiSelectField';
import DateField from './fields/DateField';
import SearchField from './fields/SearchField';
import PhoneField from './fields/PhoneField';
import HiddenObjectField from './fields/HiddenObjectField';
import FieldHelperText from './fields/FieldHelperText';
import { useFormInstance, useFormStore } from '../hooks/useFormStore';
import { hasApiValidation, triggerApiValidation } from '../utils/apiValidation';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange?: (field: string, value: any) => void;
  onBlur?: (field: string) => void;
  values?: Record<string, any>;
  stepResponses?: Record<number, { success: boolean; message?: string; data?: Record<string, any> }>;
  getStepResponseData?: (step: number, key?: string) => any;
  currentStep?: number;
  formId?: string; // Add formId prop to identify which form instance to use
}

// This component subscribes to validating state
const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange: propOnChange,
  onBlur: propOnBlur,
  values = {},
  stepResponses,
  getStepResponseData,
  currentStep,
  formId = 'default', // Use a default form ID if not provided
}) => {
  // Get the form instance
  const formInstance = useFormInstance(formId);

  // Check if this field's value exists in any previous step's response
  let fieldValue = value;
  if (getStepResponseData && currentStep && currentStep > 0 && stepResponses) {
    // Check all previous steps for this field's value
    for (let step = 0; step < currentStep; step++) {
      const stepResponse = stepResponses[step];
      if (stepResponse && stepResponse.data && stepResponse.data[field.name] !== undefined) {
        // Use the value from the previous step's response
        fieldValue = stepResponse.data[field.name];
        break; // Use the most recent value if it appears in multiple steps
      }
    }
  }

  // Memoize callbacks to prevent recreating them on every render
  const onChange = useCallback((newValue: any) => {
    // Call the onChange prop if provided
    if (propOnChange) {
      propOnChange(field.name, newValue);
    }

    // Run field-specific onChange handler if provided
    if (field.onChange) {
      field.onChange(newValue, values);
    }

    // Clear any existing errors for this field when the value changes
    formInstance.setError(field.name, null);

    // Check if field has API validation rules and trigger validation
    if (field.validation && hasApiValidation(field.validation)) {
      field.validation.forEach(rule => {
        if (rule.type === 'apiValidation') {
          // Pass the store instance to avoid getState() call in the validation function
          triggerApiValidation(field.name, newValue, rule, useFormStore.getState());
        }
      });
    }
  }, [field.name, field.onChange, field.validation, propOnChange, values, formInstance]);

  const onBlur = useCallback(() => {
    // Call the onBlur prop if provided
    if (propOnBlur) {
      propOnBlur(field.name);
    }

    // Run field-specific onBlur handler if provided
    if (field.onBlur) {
      field.onBlur(fieldValue, values);
    }
  }, [field.name, field.onBlur, propOnBlur, fieldValue, values]);

  // Use custom renderer if provided
  if (field.render) {
    return field.render(field, fieldValue, onChange);
  }

  // Skip rendering if field is hidden
  if (field.hidden) {
    return null;
  }

  // Render different field types
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'number':
        return (
          <TextField
            field={field}
            value={fieldValue}
            error={error}
            touched={touched}
            type={field.type}
            onChange={onChange}
            onBlur={onBlur}
            isValidating={formInstance.validatingFields?.[field.name] || false}
            formId={formId}
          />
        );

      case 'textarea':
        return (
          <TextareaField
            field={field}
            value={fieldValue}
            error={error}
            touched={touched}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'checkbox':
        return (
          <CheckboxField
            field={field}
            value={fieldValue}
            error={error}
            touched={touched}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'radio':
        return (
          <RadioField
            field={field}
            value={fieldValue}
            error={error}
            touched={touched}
            onChange={onChange}
            onBlur={onBlur}
          />
        );



      case 'date':
        return (
          <DateField
            field={field}
            value={fieldValue}
            error={error}
            touched={touched}
            onChange={onChange}
            onBlur={onBlur}
          />
        );
        case 'select':
          return (
            <SearchField
              field={field}
              value={fieldValue}
              error={error}
              touched={touched}
              onChange={onChange}
              onBlur={onBlur}
              dependencyValues={values}
            />
          );
          case 'multiSelect':
            return (
              <MultiSelectField
                field={field}
                value={Array.isArray(fieldValue) ? fieldValue : []}
                error={error}
                touched={touched}
                onChange={onChange}
                onBlur={onBlur}
                dependencyValues={values}
              />
            );

          case 'phone':
            return (
              <PhoneField
                field={field}
                value={fieldValue || ''}
                error={error}
                touched={touched}
                onChange={onChange}
                onBlur={onBlur}
              />
            );
            
          case 'hiddenObject':
            return (
              <HiddenObjectField
                field={field}
                value={fieldValue}
                onChange={onChange}
                onBlur={onBlur}
                values={values}
              />
            );

          default:
            return <div>Unsupported field type: {field.type}</div>;
    }
  };

  // For hiddenObject type, just render the field without any wrapper
  if (field.type === 'hiddenObject') {
    return renderField();
  }

  // For checkbox type, the label is already rendered with the checkbox
  if (field.type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderField()}
        <FieldHelperText
          error={error}
          touched={touched}
          helperText={field.helperText}
        />
      </div>
    );
  }

  // For all other field types
  return (
    <div className="mb-4">
      <Label htmlFor={field.name} className="block mb-2">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      <FieldHelperText
        error={error}
        touched={touched}
        helperText={field.helperText}
      />
    </div>
  );
};

// Use memo to prevent unnecessary rerenders
export default memo(FormField);
