"use client";
import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { DropdownOption } from "@/modules/table/utils/tableTypes";
import { useDynamicOptions } from "./dropdowns/useDynamicOptions";
import ComboBoxDropdown from "./dropdowns/ComboBoxDropdown";
import { DynamicDropdownConfig } from "./dropdowns/DropdownUtils";
import { useToast } from "@/modules/table/hooks/use-toast";
import PaginatedDropdown from "./dropdowns/PaginatedDropdown";

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
  placeholder = "Select option",
}) => {
  const { toast } = useToast();
  const [previousDependencyValues, setPreviousDependencyValues] = useState<
    Record<string, string>
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

  // Log component rendering and props for debugging
  useEffect(() => {
    console.log(`DropdownSearch - ${columnKey} render:`, {
      value,
      dependencies,
      dynamicConfig,
      options: options.length > 0 ? options : "empty static options",
      dynamicOptions:
        dynamicOptions.length > 0 ? dynamicOptions : "empty dynamic options",
      paginationEnabled: dynamicConfig?.paginationEnabled || false,
    });
  }, [
    value,
    dependencies,
    dynamicConfig,
    dynamicOptions.length,
    options,
    columnKey,
  ]);

  // Handle dependency changes to clear child values - this effect runs only when dependencies change
  useEffect(() => {
    if (
      !dependencies ||
      !dynamicConfig?.dependsOn ||
      processingDependencyChange.current
    ) {
      return;
    }

    const dependencyKey = dynamicConfig.dependsOn;
    const currentValue = dependencies[dependencyKey] || "";
    const previousValue = previousDependencyValues[dependencyKey] || "";

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
        to: currentValue,
      });

      // Set flag to prevent re-triggering the effect
      processingDependencyChange.current = true;

      // Clear the value immediately without checking if it's already empty
      if (value !== "") {
        onChangeRef.current("");
      }

      // Update the stored previous value
      setPreviousDependencyValues((prev) => ({
        ...prev,
        [dependencyKey]: currentValue,
      }));

      // Reset the flag
      setTimeout(() => {
        processingDependencyChange.current = false;
      }, 0);
    }
  }, [dependencies, dynamicConfig?.dependsOn, columnKey, value]);

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
    (newValue: string) => {
      if (newValue !== value) {
        console.log(`DropdownSearch - onChange for ${columnKey}: ${newValue}`);
        onChange(newValue);
      }
    },
    [onChange, columnKey, value]
  );

  // Determine if the dropdown should be disabled
  const isDisabled = !!(
    dynamicConfig?.dependsOn &&
    (!dependencies ||
      !dependencies[dynamicConfig.dependsOn] ||
      dependencies[dynamicConfig.dependsOn] === "")
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

  // Otherwise use the regular ComboBoxDropdown
  return (
    <ComboBoxDropdown
      columnKey={columnKey}
      label={label}
      value={value}
      onChange={handleChange}
      options={dynamicConfig ? dynamicOptions : options}
      dynamicConfig={dynamicConfig}
      dependencies={dependencies}
      placeholder={placeholder}
      isDisabled={isDisabled}
    />
  );
};

export default memo(DropdownSearch);
