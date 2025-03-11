
import React from 'react';
import { Input } from '@/modules/table/components/ui/input';
import { FieldProps } from '../field-types';
import { cn } from '@/lib/utils';

const TextField: React.FC<FieldProps & { type: 'text' | 'email' | 'password' | 'number' }> = ({
  field,
  value,
  error,
  touched,
  type,
  onChange,
  onBlur
}) => {
  return (
    <Input
      id={field.name}
      name={field.name}
      type={type}
      placeholder={field.placeholder}
      value={value || ''}
      onChange={(e) => onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)}
      disabled={field.disabled}
      readOnly={field.readOnly}
      autoFocus={field.autoFocus}
      className={cn(
        field.className,
        error && touched ? 'border-destructive focus-visible:ring-destructive' : ''
      )}
      onBlur={onBlur}
    />
  );
};

export default TextField;
