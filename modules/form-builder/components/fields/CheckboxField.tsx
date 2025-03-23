import React, { memo } from 'react';
import { Checkbox } from '@/modules/table/components/ui/checkbox';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { Label } from '@/modules/table/components/ui/label';

interface CheckboxFieldProps {
  field: FieldConfig;
  value: boolean;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: boolean) => void;
  onBlur: () => void;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={field.name}
        name={field.name}
        checked={value || false}
        disabled={field.disabled}
        className={cn(
          field.className,
          !!error && touched ? 'border-destructive' : ''
        )}
        onCheckedChange={(checked) => onChange(!!checked)}
        onBlur={onBlur}
      />
      <Label
        htmlFor={field.name}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          field.required && "after:content-['*'] after:ml-0.5 after:text-destructive"
        )}
      >
        {field.label}
      </Label>
    </div>
  );
};

export default memo(CheckboxField);