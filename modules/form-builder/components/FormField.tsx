import React, { useCallback, memo } from 'react';
import { FieldConfig } from '../types/formTypes';
import { Label } from '@/modules/table/components/ui/label';
import TextField from './fields/TextField';
import TextareaField from './fields/TextareaField';
import CheckboxField from './fields/CheckboxField';
import RadioField from './fields/RadioField';
import SelectField from './fields/SelectField';
import DateField from './fields/DateField';
import SearchField from './fields/SearchField';
import FieldHelperText from './fields/FieldHelperText';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched?: boolean;
  onChange?: (field: string, value: any) => void;
  onBlur?: (field: string) => void;
  values?: Record<string, any>;
}

// This component doesn't subscribe to any store values
const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange: propOnChange,
  onBlur: propOnBlur,
  values = {},
}) => {
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
  }, [field.name, field.onChange, propOnChange, values]);

  const onBlur = useCallback(() => {
    // Call the onBlur prop if provided
    if (propOnBlur) {
      propOnBlur(field.name);
    }

    // Run field-specific onBlur handler if provided
    if (field.onBlur) {
      field.onBlur(value, values);
    }
  }, [field.name, field.onBlur, propOnBlur, value, values]);

  // Use custom renderer if provided
  if (field.render) {
    return field.render(field, value, onChange);
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
            value={value}
            error={error}
            touched={touched}
            type={field.type}
            onChange={onChange}
            onBlur={onBlur}
          />
        );

      case 'textarea':
        return (
          <TextareaField
            field={field}
            value={value}
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
            value={value}
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
            value={value}
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
            value={value}
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
            value={value}
            error={error}
            touched={touched}
            onChange={onChange}
            onBlur={onBlur}
            dependencyValues={values}
          />
        );

      default:
        return <div>Unsupported field type: {field.type}</div>;
    }
  };

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