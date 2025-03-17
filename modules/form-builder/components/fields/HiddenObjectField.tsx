import React, { memo } from 'react';
import { FieldConfig } from '../../types/formTypes';

interface HiddenObjectFieldProps {
  field: FieldConfig;
  value: any; // Can be an object or array of objects
  onChange: (value: any) => void;
  onBlur: () => void;
}

/**
 * HiddenObjectField component
 * 
 * This field accepts an object or array of objects as a hidden visual object.
 * It doesn't render any visible UI elements but stores the data in the form state.
 */
const HiddenObjectField: React.FC<HiddenObjectFieldProps> = ({
  field,
  value,
  onChange,
  onBlur
}) => {
  // This field doesn't render any visible UI elements
  // It just stores the object or array in the form state
  
  // We use a useEffect to ensure the value is properly initialized
  React.useEffect(() => {
    // If no value is set and a default value is provided in the field config,
    // initialize with the default value
    if (value === undefined && field.defaultValue !== undefined) {
      onChange(field.defaultValue);
    }
  }, [field.defaultValue, onChange, value]);

  // Return null as this is a hidden field
  return null;
};

export default memo(HiddenObjectField);