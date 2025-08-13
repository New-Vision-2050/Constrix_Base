import React, { memo, useState, useEffect, useRef } from 'react';
import { Button } from '@/modules/table/components/ui/button';
import { Clock } from 'lucide-react';
import { FieldConfig } from '../../types/formTypes';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/table/components/ui/popover';
import { Input } from '@/modules/table/components/ui/input';

interface TimeFieldProps {
  field: FieldConfig;
  value: string;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: any) => void;
  onBlur: () => void;
}

const TimeField: React.FC<TimeFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
}) => {
  // State to handle the time value
  const [valueState, setValueState] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  
  // Update internal state when prop changes
  useEffect(() => {
    setValueState(value || '');
  }, [value]);

  // Parse time string to hours and minutes
  const parseTime = (timeString: string) => {
    if (!timeString) return { hours: '00', minutes: '00' };
    
    const [hours, minutes] = timeString.split(':');
    return {
      hours: hours?.padStart(2, '0') || '00',
      minutes: minutes?.padStart(2, '0') || '00',
    };
  };

  // Time values
  const { hours, minutes } = parseTime(valueState);
  
  // Format time to "hh:mm"
  const formatTime = (hours: string, minutes: string) => {
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  const handleTimeChange = (type: 'hours' | 'minutes', newValue: string) => {
    // Allow empty string for manual input
    if (newValue === '') {
      if (type === 'hours') {
        setHoursInput('');
      } else {
        setMinutesInput('');
      }
      return;
    }
    
    // Only check if it's a numeric input
    if (!/^\d+$/.test(newValue)) {
      return; // Don't update for non-numeric values
    }
    
    // Store the raw input first without validation to allow multi-digit typing
    if (type === 'hours') {
      // Only update if it's a valid number or the length is 2 or less
      if (newValue.length <= 2 && parseInt(newValue, 10) <= 23) {
        setHoursInput(newValue);
      }
    } else {
      // Only update if it's a valid number or the length is 2 or less
      if (newValue.length <= 2 && parseInt(newValue, 10) <= 59) {
        setMinutesInput(newValue);
      }
    }
  };
  
  // For direct manual input
  const [hoursInput, setHoursInput] = useState(hours);
  const [minutesInput, setMinutesInput] = useState(minutes);
  
  // Update the inputs when valueState changes
  useEffect(() => {
    if (valueState) {
      const { hours: parsedHours, minutes: parsedMinutes } = parseTime(valueState);
      setHoursInput(parsedHours);
      setMinutesInput(parsedMinutes);
    } else {
      setHoursInput('');
      setMinutesInput('');
    }
  }, [valueState]);
  
  // Handle blur events to validate and format the inputs
  const handleHoursBlur = () => {
    if (hoursInput === '') {
      setHoursInput('00');
      const formattedTime = formatTime('00', minutes);
      setValueState(formattedTime);
      onChange(formattedTime);
      return;
    }
    
    let value = parseInt(hoursInput, 10);
    if (isNaN(value)) {
      value = 0;
    }
    value = Math.min(Math.max(value, 0), 23);
    const formattedHours = value.toString().padStart(2, '0');
    setHoursInput(formattedHours);
    const formattedTime = formatTime(formattedHours, minutes);
    setValueState(formattedTime);
    onChange(formattedTime);
  };
  
  const handleMinutesBlur = () => {
    if (minutesInput === '') {
      setMinutesInput('00');
      const formattedTime = formatTime(hours, '00');
      setValueState(formattedTime);
      onChange(formattedTime);
      return;
    }
    
    let value = parseInt(minutesInput, 10);
    if (isNaN(value)) {
      value = 0;
    }
    value = Math.min(Math.max(value, 0), 59);
    const formattedMinutes = value.toString().padStart(2, '0');
    setMinutesInput(formattedMinutes);
    const formattedTime = formatTime(hours, formattedMinutes);
    setValueState(formattedTime);
    onChange(formattedTime);
  };

  // Ensure popover closes correctly
  const handleApply = () => {
    // Make sure the inputs are properly formatted
    if (hoursInput || minutesInput) {
      handleHoursBlur();
      handleMinutesBlur();
    }
    
    // Close the popover and trigger onBlur
    setIsOpen(false);
    onBlur();
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
              !valueState && "text-muted-foreground",
              !!error && touched ? 'border-destructive' : '',
              field.className,
              field.width ? field.width : 'w-full'
            )}
            disabled={field.disabled}
          >
            <Clock className="mr-2 h-4 w-4" />
            {valueState || field.placeholder || 'Select time'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground mb-1">Hours</label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={hoursInput}
                onChange={(e) => handleTimeChange('hours', e.target.value)}
                onBlur={handleHoursBlur}
                className="w-16"
                maxLength={2}
                placeholder="00"
              />
            </div>
            <span className="text-lg pt-6">:</span>
            <div className="flex flex-col">
              <label className="text-xs text-muted-foreground mb-1">Minutes</label>
              <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={minutesInput}
                onChange={(e) => handleTimeChange('minutes', e.target.value)}
                onBlur={handleMinutesBlur}
                className="w-16"
                maxLength={2}
                placeholder="00"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Clear values with proper null check
                try {
                  setValueState('');
                  setHoursInput('');
                  setMinutesInput('');
                  // Ensure we pass a valid empty value that won't cause iterable errors
                  onChange('');
                  setIsOpen(false);
                  onBlur();
                } catch (error) {
                  console.error('Error clearing time field:', error);
                }
              }}
            >
              Clear
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
            >
              Apply
            </Button>
          </div>
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

export default memo(TimeField);
