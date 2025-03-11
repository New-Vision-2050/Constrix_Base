
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/modules/table/components/ui/button';
import { Calendar } from '@/modules/table/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/table/components/ui/popover';
import { FieldProps } from '../field-types';
import { cn } from '@/lib/utils';

const DateField: React.FC<FieldProps & { onChange: (value: Date | undefined) => void, onBlur: () => void }> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && touched ? 'border-destructive' : '',
            field.className
          )}
          disabled={field.disabled}
          onBlur={onBlur}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "PPP") : field.placeholder || "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value ? new Date(value) : undefined}
          onSelect={onChange}
          disabled={field.disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateField;
