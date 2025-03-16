import React, { memo } from 'react';
import { Textarea } from '@/modules/table/components/ui/textarea';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';

interface TextareaFieldProps {
  field: FieldConfig;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const TextareaField: React.FC<TextareaFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  return (
    <Textarea
      id={field.name}
      name={field.name}
      value={value || ''}
      placeholder={field.placeholder}
      disabled={field.disabled}
      readOnly={field.readOnly}
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

export default memo(TextareaField);