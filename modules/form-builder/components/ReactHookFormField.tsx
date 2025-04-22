import React, { useCallback, memo } from 'react';
import { UseFormReturn, Controller } from 'react-hook-form';
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
import DynamicRowsField from './fields/DynamicRowsField';
import ImageField from './fields/ImageField';
import MultiImageField from './fields/MultiImageField';
import FileField from './fields/FileField';
import MultiFileField from './fields/MultiFileField';
import FieldHelperText from './fields/FieldHelperText';

interface ReactHookFormFieldProps {
  field: FieldConfig;
  form: UseFormReturn<any>;
  value: any;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange?: (field: string, value: any) => void;
  onBlur?: (field: string) => void;
  values?: Record<string, any>;
  disabled?: boolean;
  stepResponses?: Record<number, { success: boolean; message?: string; data?: Record<string, any> }>;
  getStepResponseData?: (step: number, key?: string) => any;
  currentStep?: number;
  clearFiledError: (fieldName: string) => void;
  formId?: string;
}

const ReactHookFormField: React.FC<ReactHookFormFieldProps> = ({
  field,
  form,
  value,
  error,
  touched,
  onChange: propOnChange,
  onBlur: propOnBlur,
  values = {},
  disabled = false,
  stepResponses,
  getStepResponseData,
  currentStep,
  clearFiledError,
  formId = 'default',
}) => {
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
    clearFiledError(field.name);
  }, [field.name, field.onChange, propOnChange, values, clearFiledError]);

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

  // Check if field should be rendered based on condition
  if (field.condition && !field.condition(values)) {
    return null;
  }

  // Render the field using React Hook Form's Controller
  const renderControlledField = () => {
    return (
      <Controller
        name={field.name}
        control={form.control}
        render={({ field: formField }) => {
          // Merge the React Hook Form field props with our custom props
          const fieldProps = {
            ...formField,
            onChange: (value: any) => {
              formField.onChange(value);
              onChange(value);
            },
            onBlur: () => {
              formField.onBlur();
              onBlur();
            },
            value: fieldValue !== undefined ? fieldValue : formField.value,
            disabled: disabled || field.disabled,
          };

          // Render different field types
          switch (field.type) {
            case 'text':
            case 'email':
            case 'password':
            case 'number':
              return (
                <TextField
                  field={field}
                  value={fieldProps.value}
                  error={error}
                  touched={touched}
                  type={field.type}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );

            case 'textarea':
              return (
                <TextareaField
                  field={field}
                  value={fieldProps.value}
                  error={error}
                  touched={touched}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );

            case 'checkbox':
              return (
                <CheckboxField
                  field={field}
                  value={fieldProps.value}
                  error={error}
                  touched={touched}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );

            case 'radio':
              return (
                <RadioField
                  field={field}
                  value={fieldProps.value}
                  error={error}
                  touched={touched}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );

            case 'date':
              return (
                <DateField
                  field={field}
                  value={fieldProps.value}
                  error={error}
                  touched={touched}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );

            case 'select':
              return (
                <SearchField
                  field={field}
                  value={fieldProps.value}
                  error={error}
                  touched={touched}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  dependencyValues={values}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );

            case 'multiSelect':
              return (
                <MultiSelectField
                  field={field}
                  value={Array.isArray(fieldProps.value) ? fieldProps.value : []}
                  error={error}
                  touched={touched}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  dependencyValues={values}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );

            case 'phone':
              return (
                <PhoneField
                  field={field}
                  value={fieldProps.value || ''}
                  error={error}
                  touched={touched}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );
              
            case 'hiddenObject':
              return (
                <HiddenObjectField
                  field={field}
                  value={fieldProps.value}
                  onChange={fieldProps.onChange}
                  onBlur={fieldProps.onBlur}
                  values={values}
                  // disabled={fieldProps.disabled} - Removed as it's not in the component props
                />
              );
              case 'dynamicRows':
                return (
                  <DynamicRowsField
                    field={field}
                    value={fieldProps.value || []}
                    error={error}
                    touched={touched}
                    onChange={fieldProps.onChange}
                    onBlur={fieldProps.onBlur}
                    // disabled={fieldProps.disabled} - Removed as it's not in the component props
                  />
                );
                
              case 'image':
                // Use MultiImageField if isMulti is true, otherwise use regular ImageField
                return field.isMulti ? (
                  <MultiImageField
                    field={field}
                    value={Array.isArray(fieldProps.value) ? fieldProps.value : (fieldProps.value ? [fieldProps.value] : [])}
                    error={error}
                    touched={touched}
                    onChange={fieldProps.onChange}
                    onBlur={fieldProps.onBlur}
                    formId={formId}
                  />
                ) : (
                  <ImageField
                    field={field}
                    value={fieldProps.value}
                    error={error}
                    touched={touched}
                    onChange={fieldProps.onChange}
                    onBlur={fieldProps.onBlur}
                    formId={formId}
                  />
                );
                
              case 'file':
                // Use MultiFileField if isMulti is true, otherwise use regular FileField
                return field.isMulti ? (
                  <MultiFileField
                    field={field}
                    value={Array.isArray(fieldProps.value) ? fieldProps.value : (fieldProps.value ? [fieldProps.value] : [])}
                    error={error}
                    touched={touched}
                    onChange={fieldProps.onChange}
                    onBlur={fieldProps.onBlur}
                    formId={formId}
                  />
                ) : (
                  <FileField
                    field={field}
                    value={fieldProps.value}
                    error={error}
                    touched={touched}
                    onChange={fieldProps.onChange}
                    onBlur={fieldProps.onBlur}
                    formId={formId}
                  />
                );
  
              default:
                return <div>Unsupported field type: {field.type}</div>;
          }
        }}
      />
    );
  };

  // For hiddenObject type, just render the field without any wrapper
  if (field.type === 'hiddenObject') {
    return renderControlledField();
  }

  // For checkbox type, the label is already rendered with the checkbox
  if (field.type === 'checkbox') {
    return (
      <div className="mb-4">
        {renderControlledField()}
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
    <div className={`mb-4 ${field.containerClassName || ''}`}>
      <Label htmlFor={field.name} className="block mb-2">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderControlledField()}
      <FieldHelperText
        error={error}
        touched={touched}
        helperText={field.helperText}
      />
    </div>
  );
};

// Use memo to prevent unnecessary rerenders
export default memo(ReactHookFormField);