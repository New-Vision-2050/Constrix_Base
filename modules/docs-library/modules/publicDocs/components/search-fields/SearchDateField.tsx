import React, { useState } from 'react';
import { format } from 'date-fns';
import { DayPicker } from 'react-day-picker';
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

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Format the date as ISO string
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      onChange(formattedDate);
    } else {
      onChange('');
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal bg-transparent border-gray-700 text-white",
            !date && "text-gray-400",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'd/M/yyyy') : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          disabled={disabled}
          initialFocus
          className="p-3"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center text-white",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white border border-gray-600 rounded",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-gray-700 rounded-md",
            day: "h-9 w-9 p-0 font-normal text-white hover:bg-gray-700 rounded-md",
            day_selected: "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-600",
            day_today: "bg-gray-700 text-white",
            day_outside: "text-gray-500 opacity-50",
            day_disabled: "text-gray-600 opacity-50",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default SearchDateField;
