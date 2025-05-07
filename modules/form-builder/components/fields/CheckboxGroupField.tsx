"use client";
import React, { memo, useMemo } from 'react';
import { Checkbox } from '@/modules/table/components/ui/checkbox';
import { Label } from '@/modules/table/components/ui/label';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { useDynamicOptions } from '@/modules/table/components/table/dropdowns/useDynamicOptions';
import { Loader2 } from 'lucide-react';

interface CheckboxGroupFieldProps {
  field: FieldConfig;
  value: string[] | string;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: string[] | string) => void;
  onBlur: () => void;
  dependencyValues?: Record<string, any>;
}

const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  dependencyValues = {},
}) => {
  // Use dynamic options if configured
  const { options: dynamicOptions, loading } = field?.dynamicOptions
    ? useDynamicOptions({
        dynamicConfig: field.dynamicOptions,
        dependencies: dependencyValues,
      })
    : { options: field?.options ?? [], loading: false };

  // Memoize options to prevent unnecessary rerenders
  const options = useMemo(() => {
    // Use dynamic options if available, otherwise use static options
    if (field.dynamicOptions) {
      return dynamicOptions;
    }
    return field.options || [];
  }, [field.options, field.dynamicOptions, dynamicOptions]);

  // Convert value to array if it's a string (single select mode)
  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Handle checkbox change
  const handleChange = (optionValue: string, checked: boolean) => {
    if (field.isMulti) {
      // Multi-select mode
      if (checked) {
        // Add to selected values
        onChange([...selectedValues, optionValue]);
      } else {
        // Remove from selected values
        onChange(selectedValues.filter(val => val !== optionValue));
      }
    } else {
      // Single-select mode (radio-like behavior)
      onChange(checked ? optionValue : '');
    }

    // Call onBlur to trigger validation
    onBlur();
  };

  return (
    <div className="flex flex-col space-y-2">
      {loading && (
        <div className="flex items-center text-muted-foreground text-sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading options...
        </div>
      )}

      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <Checkbox
            id={`${field.name}-${option.value}`}
            name={field.name}
            checked={selectedValues.includes(option.value)}
            disabled={field.disabled}
            className={cn(
              field.className,
              !!error && touched ? 'border-destructive' : ''
            )}
            onCheckedChange={(checked) => handleChange(option.value, !!checked)}
            onBlur={onBlur}
          />
          <Label
            htmlFor={`${field.name}-${option.value}`}
            className="text-sm font-normal"
          >
            {option.label}
          </Label>
        </div>
      ))}

      {/* Error message */}
      {!!error && touched && (
        <div className="text-destructive text-sm mt-1">
          {typeof error === 'string' ? error : error}
        </div>
      )}
    </div>
  );
};

export default memo(CheckboxGroupField);
