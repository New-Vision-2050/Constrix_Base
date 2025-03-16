import React, { memo, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/table/components/ui/select';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { DropdownOption } from '../../types/formTypes';

interface SelectFieldProps {
  field: FieldConfig;
  value: string;
  error?: string;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
  dependencyValues: Record<string, any>;
}

const SelectField: React.FC<SelectFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  dependencyValues
}) => {
  // Memoize options to prevent unnecessary rerenders
  const options = useMemo(() => field.options || [], [field.options]);
  
  return (
    <Select
      value={value || ''}
      onValueChange={onChange}
      onOpenChange={(open) => {
        if (!open) onBlur();
      }}
      disabled={field.disabled}
    >
      <SelectTrigger 
        id={field.name}
        className={cn(
          field.className,
          error && touched ? 'border-destructive' : '',
          field.width ? field.width : 'w-full'
        )}
      >
        <SelectValue placeholder={field.placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option: DropdownOption) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default memo(SelectField);