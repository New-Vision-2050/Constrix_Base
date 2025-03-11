
import React from 'react';
import { Checkbox } from '@/modules/table/components/ui/checkbox';
import { Label } from '@/modules/table/components/ui/label';
import { FieldProps } from '../field-types';
import { cn } from '@/lib/utils';

const CheckboxField: React.FC<FieldProps & { onChange: (value: boolean) => void, onBlur: () => void }> = ({
  field,
  value,
  onChange,
  onBlur
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={field.name}
        name={field.name}
        checked={!!value}
        onCheckedChange={onChange}
        disabled={field.disabled}
        className={cn(field.className)}
        onBlur={onBlur}
      />
      <Label htmlFor={field.name}>{field.label}</Label>
    </div>
  );
};

export default CheckboxField;
