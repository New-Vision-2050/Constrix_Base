import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/modules/table/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/table/components/ui/popover';
import { Button } from '@/modules/table/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for SearchDateField component
 */
interface SearchDateFieldProps {
  /** Field value */
  value?: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Field placeholder */
  placeholder?: string;
  /** Custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * SearchDateField component for date selection in search filters
 * Uses existing UI components for consistency
 */
const SearchDateField: React.FC<SearchDateFieldProps> = ({
  value,
  onChange,
  placeholder = 'تاريخ النهاية',
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const date = value ? new Date(value) : undefined;

  const handleDateChange = (dateString: string) => {
    onChange(dateString);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
            !date && "text-gray-400",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'PPP') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          value={value || ''}
          onChange={handleDateChange}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};

export default SearchDateField;
