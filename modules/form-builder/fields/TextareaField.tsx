
import React from 'react';
import { Textarea } from '@/modules/table/components/ui/textarea';
import { FieldProps } from '../field-types';
import { cn } from '@/lib/utils';

const TextareaField: React.FC<FieldProps & { onChange: (value: string) => void, onBlur: () => void }> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur
}) => {
  return (
    <Textarea
      id={field.name}
      name={field.name}
      placeholder={field.placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
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

export default TextareaField;
