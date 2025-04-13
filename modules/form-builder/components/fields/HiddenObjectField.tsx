import React, { memo, useEffect } from 'react';
import { FieldConfig } from '../../types/formTypes';

interface HiddenObjectFieldProps {
  field: FieldConfig;
  value: any; // Can be an object or array of objects
  onChange: (value: any) => void;
  onBlur: () => void;
  values?: Record<string, any>; // Form values for condition evaluation
}

/**
 * HiddenObjectField component
 *
 * This field accepts an object or array of objects as a hidden visual object.
 * It doesn't render any visible UI elements but stores the data in the form state.
 * If the field has a condition that evaluates to false, the field value will not be included in form submission.
 */
const HiddenObjectField: React.FC<HiddenObjectFieldProps> = ({
  field,
  value,
  onChange,
  onBlur,
  values = {}
}) => {
  // Check if the field should be included based on its condition
  const shouldInclude = !field.condition || field.condition(values);
  
  // We use a useEffect to ensure the value is properly initialized or cleared based on condition
  useEffect(() => {
    if (shouldInclude) {
      // If the field should be included and no value is set but a default value is provided,
      // initialize with the default value
      if (value === undefined && field.defaultValue !== undefined) {
        onChange(field.defaultValue);
      }
    } else {
      // If the field should not be included (condition is false), clear the value
      if (value !== undefined) {
        onChange(undefined);
      }
    }
  }, [field.defaultValue, field.condition, onChange, shouldInclude, value, values]);

  // Return null as this is a hidden field
  return null;
};

export default memo(HiddenObjectField);