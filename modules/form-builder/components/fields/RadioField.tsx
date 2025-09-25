import React, { memo, useMemo } from 'react';
import { RadioGroup, RadioGroupItem } from '@/modules/table/components/ui/radio-group';
import { Label } from '@/modules/table/components/ui/label';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { useLocale } from 'next-intl';

interface RadioFieldProps {
  field: FieldConfig;
  value: string;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const RadioField: React.FC<RadioFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  // Get current locale for RTL support
  const locale = useLocale();
  const isRtl = locale === 'ar';

  // Memoize options to prevent unnecessary rerenders
  const options = useMemo(() => field.options || [], [field.options]);

  return (
    <div className="flex flex-col">
      <RadioGroup
        value={value || ''}
        onValueChange={onChange}
        onBlur={onBlur}
        className={cn(
          "space-y-2",
          field.className,
          field.width ? field.width : 'w-full'
        )}
        disabled={field.disabled}
      >
        {options.map((option) => (
          <div key={option.value} className={cn(
            "flex items-center gap-2",
            isRtl ? "flex-row-reverse" : "flex-row"
          )}>
            <RadioGroupItem
              id={`${field.name}-${option.value}`}
              value={option.value}
              className={cn(
                !!error && touched ? 'border-destructive' : ''
              )}
            />
            <Label
              htmlFor={`${field.name}-${option.value}`}
              className="text-sm font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      
      {/* Error message */}
      {!!error && touched && (
        <div className="text-destructive text-sm mt-1">
          {typeof error === 'string' ? error : error}
        </div>
      )}
    </div>
  );
};

export default memo(RadioField);