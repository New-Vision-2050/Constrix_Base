import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { DynamicDropdownConfig, DropdownOption } from "@/components/shared/dropdowns/types";
import { useToast } from "@/modules/table/hooks/use-toast";
import PaginatedDropdown from './PaginatedDropdown';

interface DropdownSearchProps {
  columnKey: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options?: DropdownOption[];
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string>;
  placeholder?: string;
}

const DropdownSearch: React.FC<DropdownSearchProps> = ({
  columnKey,
  label,
  value,
  onChange,
  options = [],
  dynamicConfig,
  dependencies,
  placeholder = "Select option"
}) => {
  const { toast } = useToast();
  const [previousDependencyValues, setPreviousDependencyValues] = useState<Record<string, string>>({});
  const onChangeRef = useRef(onChange);
  const processingDependencyChange = useRef(false);
  
  // Update the ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  
  // Handle dependency changes to clear child values - this effect runs only when dependencies change
  useEffect(() => {
    if (!dependencies || !dynamicConfig?.dependsOn || processingDependencyChange.current) {
      return;
    }
    
    const dependencyKey = dynamicConfig.dependsOn;
    const currentValue = dependencies[dependencyKey] || '';
    const previousValue = previousDependencyValues[dependencyKey] || '';
    
    // Skip initial render to avoid unnecessary clearing on component initialization
    if (Object.keys(previousDependencyValues).length === 0) {
      setPreviousDependencyValues(dependencies || {});
      return;
    }
    
    // Clear value if dependency changed
    if (currentValue !== previousValue) {
      console.log(`Dependency changed for ${columnKey}:`, {
        field: dependencyKey,
        from: previousValue,
        to: currentValue
      });
      
      // Set flag to prevent re-triggering the effect
      processingDependencyChange.current = true;
      
      // Clear the value immediately without checking if it's already empty
      if (value !== '') {
        onChangeRef.current('');
      }
      
      // Update the stored previous value
      setPreviousDependencyValues(prev => ({
        ...prev,
        [dependencyKey]: currentValue
      }));
      
      // Reset the flag
      setTimeout(() => {
        processingDependencyChange.current = false;
      }, 0);
    }
  }, [dependencies, dynamicConfig?.dependsOn, columnKey, value]);
  
  // Memoize the change handler
  const handleChange = useCallback((newValue: string) => {
    if (newValue !== value) {
      onChange(newValue);
    }
  }, [onChange, value]);
  
  // Determine if the dropdown should be disabled
  const isDisabled = !!(
    dynamicConfig?.dependsOn && 
    (!dependencies || 
     !dependencies[dynamicConfig.dependsOn] || 
     dependencies[dynamicConfig.dependsOn] === '')
  );
  
  // If we're using the paginated dropdown with search
  if (dynamicConfig?.paginationEnabled) {
    return (
      <PaginatedDropdown
        columnKey={columnKey}
        label={label}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        dynamicConfig={dynamicConfig}
        dependencies={dependencies}
      />
    );
  }
  
  // For now, just return a simple dropdown until ComboBoxDropdown is properly set up
  return (
    <div>
      {!!label && <div className="text-sm font-medium mb-2">{label}</div>}
      <select
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        disabled={isDisabled}
        className="w-full p-2 border rounded"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default memo(DropdownSearch);