
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/modules/table/components/ui/select";
import LoadingSpinner from '@/modules/table/components/table/LoadingSpinner';
import { DropdownBaseProps, useDependencyMessage } from './DropdownUtils';
import { useDebounce } from '@/modules/table/hooks/useDebounce';

const SimpleSelectDropdown: React.FC<DropdownBaseProps> = ({
  columnKey,
  label,
  value,
  onChange,
  options = [],
  isDisabled = false,
  dynamicConfig,
  placeholder = "Select option"
}) => {
  const dependencyMessage = useDependencyMessage(isDisabled, dynamicConfig?.dependsOn);
  const isLoading = options.length === 0 && dynamicConfig !== undefined && !isDisabled;
  // Ensure we're working with a string value
  const stringValue = Array.isArray(value) && value.length > 0 ? value[0] : (typeof value === 'string' ? value : '');
  const [localValue, setLocalValue] = useState<string>(stringValue);
  const initialRenderRef = useRef(true);
  const prevValueRef = useRef<string>(stringValue);
  const isUpdatingRef = useRef(false);
  
  // Use debounce to prevent multiple rapid selections
  const debouncedOnChange = useDebounce((newValue: string) => {
    if (newValue !== prevValueRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      console.log(`SimpleSelectDropdown - Sending onChange: ${columnKey} = ${newValue}`);
      onChange(newValue);
      isUpdatingRef.current = false;
    }
  }, 300);

  // Update local value when prop value changes, but only if it's different
  useEffect(() => {
    // Ensure we're working with a string value
    const newStringValue = Array.isArray(value) && value.length > 0
      ? value[0]
      : (typeof value === 'string' ? value : '');
    
    console.log(`SimpleSelectDropdown - Value prop changed for ${columnKey}: ${newStringValue}`);
    if (newStringValue !== prevValueRef.current && !isUpdatingRef.current) {
      isUpdatingRef.current = true;
      setLocalValue(newStringValue);
      prevValueRef.current = newStringValue;
      isUpdatingRef.current = false;
    }
  }, [value, columnKey]);

  const handleValueChange = useCallback((newValue: string) => {
    // Skip if we're currently processing an update
    if (isUpdatingRef.current) return;
    
    console.log(`SimpleSelectDropdown - Value change: ${columnKey} = ${newValue}`);
    
    // Handle special "clear selection" case
    if (newValue === "_clear_") {
      isUpdatingRef.current = true;
      setLocalValue("");
      prevValueRef.current = "";
      isUpdatingRef.current = false;
      debouncedOnChange("");
      return;
    }
    
    // Set the local value immediately
    isUpdatingRef.current = true;
    setLocalValue(newValue);
    prevValueRef.current = newValue;
    isUpdatingRef.current = false;
    
    // Skip the onChange callback on initial mount
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }
    
    // Directly call onChange rather than using debounce for dropdown
    onChange(newValue);
  }, [debouncedOnChange, onChange, columnKey]);

  return (
    <div className="space-y-1">
      <label
        htmlFor={`search-${columnKey}`}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </label>
      <Select
        value={localValue}
        onValueChange={handleValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-full bg-background">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-popover z-50">
          <SelectItem value="_clear_">Clear selection</SelectItem>
          
          {isLoading ? (
            <div className="flex justify-center py-2">
              <LoadingSpinner size="small" />
            </div>
          ) : (
            options.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value || "_placeholder_"}
              >
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      
      {dependencyMessage && (
        <p className="text-xs text-muted-foreground mt-1">
          {dependencyMessage}
        </p>
      )}
    </div>
  );
};

export default SimpleSelectDropdown;
