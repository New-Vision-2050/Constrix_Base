import React, { useCallback, memo, useMemo } from 'react';
import { FieldConfig } from './types/formTypesShared';
import { useFormStore } from './store/useFormStore';

// Import field components
import TextField from './fields/TextField';
import TextareaField from './fields/TextareaField';
import CheckboxField from './fields/CheckboxField';
import RadioField from './fields/RadioField';
import SelectFieldShared from './fields/SelectFieldShared';
import DateField from './fields/DateField';
import FieldHelperText from './fields/FieldHelperText';
import { Label } from '@/modules/table/components/ui/label';

interface FormFieldProps {
  field: FieldConfig;
  value: any;
  error?: string;
  touched?: boolean;
}

// This component doesn't subscribe to any store values
const FormFieldShared: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  touched,
}) => {
    // Get actions directly from the store without subscribing
    const storeActions = useMemo(() => {
      const store = useFormStore.getState();
      return {
        setValue: store.setValue,
        setTouched: store.setTouched
      };
    }, []);

    // Create a function to get values directly without subscribing
    const getValues = useCallback(() => {
      return useFormStore.getState().values;
    }, []);

    // Memoize callbacks to prevent recreating them on every render
    const onChange = useCallback((newValue: any) => {
        storeActions.setValue(field.name, newValue);

        // Run field-specific onChange handler if provided
        if (field.onChange) {
            // Get the latest values directly without subscribing
            const allValues = getValues();
            field.onChange(newValue, allValues);
        }
    }, [field.name, field.onChange, storeActions.setValue, getValues]);

    const onBlur = useCallback(() => {
        storeActions.setTouched(field.name, true);

        // Run field-specific onBlur handler if provided
        if (field.onBlur) {
            // Get the latest values directly without subscribing
            const allValues = getValues();
            field.onBlur(value, allValues);
        }
    }, [field.name, field.onBlur, storeActions.setTouched, value, getValues]);

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

      case 'select':
        return (
          <SelectFieldShared
            field={field}
            value={value}
            error={error}
            touched={touched}
            onChange={onChange}
            onBlur={onBlur}
            dependencyValues={getValues()}
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
export default memo(FormFieldShared);