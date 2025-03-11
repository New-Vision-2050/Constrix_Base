
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/modules/table/components/ui/radio-group';
import { Label } from '@/modules/table/components/ui/label';
import { FieldProps } from '../field-types';
import { cn } from '@/lib/utils';

const RadioField: React.FC<FieldProps & { onChange: (value: string) => void, onBlur: () => void }> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur
}) => {
  return (
    <RadioGroup
      id={field.name}
      name={field.name}
      value={value || ''}
      onValueChange={onChange}
      disabled={field.disabled}
      className={cn(field.className, error && touched ? 'border-destructive' : '')}
      onBlur={onBlur}
    >
      {field.options?.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
          <Label htmlFor={`${field.name}-${option.value}`}>{option.label}</Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default RadioField;
