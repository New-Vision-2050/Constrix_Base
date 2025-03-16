import React, { memo } from 'react';
import { Input } from '@/modules/table/components/ui/input';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';

interface TextFieldProps {
  field: FieldConfig;
  value: string;
  error?: string;
  touched?: boolean;
  type?: 'text' | 'email' | 'password' | 'number';
  onChange: (value: string) => void;
  onBlur: () => void;
}

const TextField: React.FC<TextFieldProps> = ({
  field,
  value,
  error,
  touched,
  type = 'text',
  onChange,
  onBlur,
}) => {
  return (
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
        field.width ? field.width : 'w-full'
      )}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
};

export default memo(TextField);