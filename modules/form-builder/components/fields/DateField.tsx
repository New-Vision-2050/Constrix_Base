import React, { memo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/modules/table/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/table/components/ui/popover';
import { Button } from '@/modules/table/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { FieldConfig } from '../../types/formTypes'
import { cn } from '@/lib/utils';
import { DayPickerSingleProps } from 'react-day-picker';
import { HijriCalendar } from '@/modules/table/components/ui/HijriCalendar'
import { useFormStore } from '@/modules/form-builder'

interface DateFieldProps extends Omit<DayPickerSingleProps, 'mode' | 'selected' | 'onSelect'> {
  field: FieldConfig;
  value: string;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: any) => void;
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
  // Handle both string date and Date object for flexibility
  const [valueState, setValueState] = useState(value);
  
  // Update internal state when prop changes
  useEffect(() => {
    setValueState(value);
  }, [value]);
  
  const date = !field?.isHijri && valueState ? new Date(valueState) : undefined;
  const [isOpen, setIsOpen] = useState(false);

  const getMinDate = () =>{
    let minDate = field?.minDate?.value ?? (field?.minDate?.formId ? useFormStore
      ?.getState()
      .getValue(field?.minDate?.formId || '', field?.minDate?.field || ''): undefined)

    let newDate =  minDate ? new Date(minDate): undefined;
    if(newDate && field?.minDate?.shift?.value){
      newDate = adjustDate(newDate, field?.minDate?.shift?.value, field?.minDate?.shift?.unit??'days');
    }

    return newDate;
  }
  
  const getMaxDate = () =>{
    let maxDate = field?.maxDate?.value ?? (field?.maxDate?.formId ? useFormStore
      ?.getState()
      .getValue(field?.maxDate?.formId || '', field?.maxDate?.field || ''): undefined)

    let newDate =  maxDate ? new Date(maxDate): undefined;
    if(newDate && field?.maxDate?.shift?.value){
      newDate = adjustDate(newDate, field?.maxDate?.shift?.value, field?.maxDate?.shift?.unit??'days');
    }

    return newDate;
  }

  const adjustDate = (date: Date, value: number, unit: 'days' | 'months' | 'years' = 'days') => {
    let result = date;

    switch(unit) {
      case 'years':
        result.setFullYear(result.getFullYear() + value);
        break;
      case 'months':
        const currentMonth = result.getMonth();
        result.setMonth(currentMonth + value);
        break;
      default:
        result.setDate(result.getDate() + value);
    }
    return result;
  }
  
  const handleDateChange = (newValue: string | null) => {
    const finalValue = newValue || '';
    // Update internal state for UI
    setValueState(finalValue);
    // Call parent onChange
    onChange(finalValue);
  };
  
  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
        <Button
          id={field.name}
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            (!date || !valueState) && "text-muted-foreground",
            !!error && touched ? 'border-destructive' : '',
            field.className,
            field.width ? field.width : 'w-full'
          )}
          disabled={field.disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {valueState
            ? field?.isHijri
              ? valueState
              : format(new Date(valueState), 'PPP')
            : field.placeholder || 'Select a date'}
        </Button>
      </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
        {field?.isHijri
          ? <HijriCalendar
              value={valueState ?? undefined}
              onChange={(dateObj) => {
                handleDateChange(dateObj ? dateObj?.toString() : null);
                onBlur();
                setIsOpen(false);
              }}
              {...((field?.minDate?.formId && field?.minDate?.field) || field?.minDate?.value)? {minDate: getMinDate()}:{}}
              {...((field?.maxDate?.formId && field?.maxDate?.field) || field?.maxDate?.value)? {maxDate: getMaxDate()}:{}}
              {...Object.fromEntries(Object.entries(props).filter(([key]) => key !== 'locale'))}
            />
          : <Calendar
            mode="single"
            selected={date}
            onSelect={(date) => {
              const formattedDate = date ? format(date, "yyyy-MM-dd'T'00:00:00.000'Z'") : null;
              handleDateChange(formattedDate);
              onBlur();
              setIsOpen(false);
            }}
            disabled={field.disabled}
            initialFocus
            {...((field?.minDate?.formId && field?.minDate?.field) || field?.minDate?.value)? {fromDate: getMinDate()}:{}}
            {...((field?.maxDate?.formId && field?.maxDate?.field) || field?.maxDate?.value)? {toDate: getMaxDate()}:{}}
            {...props}
          />}
        </PopoverContent>
      </Popover>
      
      {/* Error message */}
      {!!error && touched && (
        <div className="text-destructive text-sm mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default memo(DateField);