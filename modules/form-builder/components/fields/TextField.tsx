import React, { memo } from 'react';
import { Input } from '@/modules/table/components/ui/input';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { useFormStore } from '../../hooks/useFormStore';

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
  // Get validating state from the store
  const validatingFields = useFormStore((state) => state.validatingFields);
  const isFieldValidating = isValidating || validatingFields[field.name];

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
          error && touched ? 'border-destructive' : '',
          isFieldValidating ? 'pr-10' : '',
          field.width ? field.width : 'w-full'
        )}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
      {isFieldValidating && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
};

export default memo(TextField);