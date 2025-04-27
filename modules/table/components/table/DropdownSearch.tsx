"use client";
import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { DropdownOption } from "@/modules/table/utils/tableTypes";
import { useDynamicOptions } from "./dropdowns/useDynamicOptions";
import ComboBoxDropdown from "./dropdowns/ComboBoxDropdown";
import { DynamicDropdownConfig } from "@/modules/form-builder/types/formTypes";
import { useToast } from "@/modules/table/hooks/use-toast";
import PaginatedDropdown from "./dropdowns/PaginatedDropdown";

interface DropdownSearchProps {
  columnKey: string;
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  options?: DropdownOption[];
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string | string[]>;
  placeholder?: string;
  isMulti?: boolean;
  isDisabled?: boolean;
}
const DropdownSearch: React.FC<DropdownSearchProps> = ({
  columnKey,
  label,
  value,
  onChange,
  options = [],
  dynamicConfig,
  dependencies,
  placeholder = "Select option",
  isMulti = false,
  isDisabled=undefined
}) => {
  const { toast } = useToast();

  const [previousDependencyValues, setPreviousDependencyValues] = useState<
    Record<string, string | string[]>
  >({});
  const onChangeRef = useRef(onChange);
  const processingDependencyChange = useRef(false);

  // Update the ref when onChange changes
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Only use the useDynamicOptions hook if pagination is not enabled and we're using dynamic options
  const {
    options: dynamicOptions,
    loading,
    error,
    refresh,
  } = dynamicConfig && !dynamicConfig.paginationEnabled
    ? useDynamicOptions({
        dynamicConfig,
        dependencies,
      })
    : { options: [], loading: false, error: null, refresh: () => {} };

  // Handle dependency changes to clear child values - this effect runs only when dependencies change
  useEffect(() => {
    if (
      !dependencies ||
      !dynamicConfig?.dependsOn ||
      processingDependencyChange.current
    ) {
      return;
    }

    // Skip initial render to avoid unnecessary clearing on component initialization
    if (Object.keys(previousDependencyValues).length === 0) {
      setPreviousDependencyValues(dependencies || {});
      return;
    }

    // Function to check if a dependency has changed
    const hasDependencyChanged = () => {
      // Case 1: String format (backward compatibility)
      if (typeof dynamicConfig.dependsOn === 'string') {
        const dependencyKey = dynamicConfig.dependsOn;
        const currentValue = dependencies[dependencyKey] || "";
        const previousValue = previousDependencyValues[dependencyKey] || "";

        if (currentValue !== previousValue) {
          console.log(`Dependency changed for ${columnKey}:`, {
            field: dependencyKey,
            from: previousValue,
            to: currentValue,
          });
          return true;
        }
      }
      // Case 2: Array of dependency configs
      else if (Array.isArray(dynamicConfig.dependsOn)) {
        for (const depConfig of dynamicConfig.dependsOn) {
          const field = depConfig.field;
          const currentValue = dependencies[field] || "";
          const previousValue = previousDependencyValues[field] || "";

          if (currentValue !== previousValue) {
            console.log(`Dependency changed for ${columnKey}:`, {
              field,
              from: previousValue,
              to: currentValue,
            });
            return true;
          }
        }
      }
      // Case 3: Object with field names as keys
      else if (typeof dynamicConfig.dependsOn === 'object') {
        for (const field of Object.keys(dynamicConfig.dependsOn)) {
          const currentValue = dependencies[field] || "";
          const previousValue = previousDependencyValues[field] || "";

          if (currentValue !== previousValue) {
            console.log(`Dependency changed for ${columnKey}:`, {
              field,
              from: previousValue,
              to: currentValue,
            });
            return true;
          }
        }
      }

      return false;
    };

    // If any dependency has changed, clear the value
    if (hasDependencyChanged()) {
      // Set flag to prevent re-triggering the effect
      processingDependencyChange.current = true;

      // Clear the value based on whether it's multi-select or not
      const isEmpty = isMulti
        ? Array.isArray(value) && value.length === 0
        : value === "";

      if (!isEmpty) {
        onChangeRef.current(isMulti ? [] : "");
      }

      // Update the stored previous values
      setPreviousDependencyValues(dependencies || {});

      // Reset the flag
      setTimeout(() => {
        processingDependencyChange.current = false;
      }, 0);
    }
  }, [dependencies, dynamicConfig?.dependsOn, columnKey, value, isMulti]);

  // Handle API errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading options",
        description: `Failed to load options for ${label}: ${error}`,
        variant: "destructive",
      });
    }
  }, [error, label, toast]);

  // Memoize the change handler
  const handleChange = useCallback(
    (newValue: string | string[]) => {
      const isEqual = isMulti
        ? Array.isArray(value) && Array.isArray(newValue) &&
          JSON.stringify(value) === JSON.stringify(newValue)
        : newValue === value;

      if (!isEqual) {
        console.log(`DropdownSearch - onChange for ${columnKey}:`, newValue);
        onChange(newValue);
      }
    },
    [onChange, columnKey, value, isMulti]
  );

if(isDisabled === undefined) {
    // Determine if the dropdown should be disabled
    isDisabled = (() => {
        if (!dynamicConfig?.dependsOn || !dependencies) return false;

        // Case 1: String format (backward compatibility)
        if (typeof dynamicConfig.dependsOn === 'string') {
            return !dependencies[dynamicConfig.dependsOn];
        }

        // Case 2: Array of dependency configs
        if (Array.isArray(dynamicConfig.dependsOn)) {
            return dynamicConfig.dependsOn.some(
                depConfig => !dependencies[depConfig.field]
            );
        }

        // Case 3: Object with field names as keys
        if (typeof dynamicConfig.dependsOn === 'object') {
            return Object.keys(dynamicConfig.dependsOn).some(
                field => !dependencies[field]
            );
        }

        return false;
    })();
}

  // Convert value to appropriate type based on isMulti
  const processedValue = isMulti
    ? (Array.isArray(value) ? value : value ? [value] : [])
    : (Array.isArray(value) && value.length > 0 ? value[0] : value || '');

  // If we're using the paginated dropdown with search
  if (dynamicConfig?.paginationEnabled) {
    return (
      <PaginatedDropdown
        columnKey={columnKey}
        label={label}
        value={processedValue}
        onChange={handleChange}
        placeholder={placeholder}
        isDisabled={isDisabled}
        dynamicConfig={dynamicConfig}
        dependencies={dependencies}
        isMulti={isMulti}
      />
    );
  }

  // Otherwise use the regular ComboBoxDropdown
  return (
    <ComboBoxDropdown
      columnKey={columnKey}
      label={label}
      value={processedValue}
      onChange={handleChange}
      options={dynamicConfig ? dynamicOptions : options}
      dynamicConfig={dynamicConfig}
      dependencies={dependencies}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isMulti={isMulti}
    />
  );
};

export default memo(DropdownSearch);
