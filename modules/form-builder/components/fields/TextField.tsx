import React, { memo, useEffect, useState } from 'react';
import { Input } from '@/modules/table/components/ui/input';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { useFormStore } from '../../hooks/useFormStore';
import { XCircle, CheckCircle } from 'lucide-react';
import { hasApiValidation } from '../../utils/apiValidation';

interface TextFieldProps {
  field: FieldConfig;
  value: string;
  error?: string;
  touched?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  onChange: (value: string) => void;
  onBlur: () => void;
  isValidating?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  error,
  touched,
  type = 'text',
  onChange,
  onBlur,
  isValidating,
}) => {
  // Track whether the field has been API validated
  const [hasBeenApiValidated, setHasBeenApiValidated] = useState(false);

  // Get validating state from the store
  const validatingFields = useFormStore((state) => state.validatingFields);
  const errors = useFormStore((state) => state.errors);
  const isFieldValidating = isValidating || validatingFields[field.name];
  const showError = error && touched;

  // Check if this field has API validation
  const hasApiVal = field.validation ? hasApiValidation(field.validation) : false;

  // Track when API validation completes
  useEffect(() => {
    if (hasApiVal && touched && !isFieldValidating && value) {
      setHasBeenApiValidated(true);
    }
  }, [hasApiVal, touched, isFieldValidating, value]);

  // Determine if field has been validated successfully
  // A field is considered successfully validated if:
  // 1. It has been touched (user interacted with it)
  // 2. It has a value (not empty)
  // 3. It has no errors
  // 4. It's not currently being validated
  // 5. If it has API validation, it must have been validated by the API
  const hasValue = value !== undefined && value !== null && value !== '';
  const isValidated = touched && hasValue && !error && !isFieldValidating &&
                     (!hasApiVal || (hasApiVal && hasBeenApiValidated));

  // Show icon if field is validating, has error, or has been successfully validated
  const showIcon = isFieldValidating || showError || isValidated;

  return (
    <div className="relative">
      <Input
        id={field.name}
        name={field.name}
        type={type}
        value={value || ''}
        placeholder={field.placeholder}
        disabled={field.disabled}
        readOnly={field.readOnly}
        autoFocus={field.autoFocus}
        className={cn(
          field.className,
          showError ? 'border-destructive pr-10' : '',
          isValidated ? 'border-green-500 pr-10' : '',
          isFieldValidating ? 'pr-10' : '',
          field.width ? field.width : 'w-full'
        )}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {showIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isFieldValidating ? (
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          ) : showError ? (
            <XCircle className="h-4 w-4 text-destructive" />
          ) : isValidated ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : null}
        </div>
      )}
    </div>
  );
};

export default memo(TextField);
