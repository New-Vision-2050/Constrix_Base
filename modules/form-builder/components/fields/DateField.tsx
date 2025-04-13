import React, { memo, useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/modules/table/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/table/components/ui/popover';
import { Button } from '@/modules/table/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { DayPickerSingleProps } from 'react-day-picker'; 

interface DateFieldProps extends Omit<DayPickerSingleProps, 'mode' | 'selected' | 'onSelect'> {
  field: FieldConfig;
  value: string;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: string) => void;
  onBlur: () => void;
}

const DateField: React.FC<DateFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  ...props
}) => {
  const date = value ? new Date(value) : undefined;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          id={field.name}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            !!error && touched ? 'border-destructive' : '',
            field.className,
            field.width ? field.width : 'w-full'
          )}
          disabled={field.disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : field.placeholder || 'Select a date'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            onChange(date ? date.toISOString() : '');
            onBlur();
            setIsOpen(false);
          }}
          disabled={field.disabled}
          initialFocus
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
};

export default memo(DateField);
