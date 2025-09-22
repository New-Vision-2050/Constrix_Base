import React from 'react';
import { useLocale } from 'next-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/modules/table/components/ui/select';
import { cn } from '@/lib/utils';
import { DropdownOption } from './types';

/**
 * Props for SearchSelectField component
 */
interface SearchSelectFieldProps {
  /** Field value */
  value?: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Dropdown options */
  options: DropdownOption[];
  /** Field placeholder */
  placeholder?: string;
  /** Custom className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * SearchSelectField component for dropdown selection in search filters
 * Uses existing UI components for consistency
 */
const SearchSelectField: React.FC<SearchSelectFieldProps> = ({
  value,
  onChange,
  options,
  placeholder = 'اختر عنصر',
  className = '',
  disabled = false
}) => {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <Select
      value={value || ''}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger 
        className={cn(
          "w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
          !value && "text-gray-400",
          isRtl ? "text-right" : "text-left",
          className
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent 
        className={cn(
          isRtl ? "text-right" : "text-left"
        )}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {options.map((option) => (
          <SelectItem 
            key={option.value} 
            value={option.value}
            className={cn(
              isRtl ? "text-right" : "text-left"
            )}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SearchSelectField;
