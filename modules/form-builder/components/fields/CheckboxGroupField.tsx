"use client";
import React, { memo, useMemo, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FieldConfig } from "../../types/formTypes";
import { useDynamicOptions } from "@/modules/table/components/table/dropdowns/useDynamicOptions";

interface CheckboxGroupFieldProps {
  field: FieldConfig;
  value: string[] | string;
  error?: string | React.ReactNode;
  touched?: boolean;
  onChange: (value: string[] | string) => void;
  onBlur: () => void;
  dependencyValues?: Record<string, any>;
}

const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  field,
  value,
  error,
  touched,
  onChange,
  onBlur,
  dependencyValues = {},
}) => {
  // State for collapsible
  const [isOpen, setIsOpen] = useState(true);

  // Use dynamic options if configured
  const { options: dynamicOptions, loading } = field?.dynamicOptions
    ? useDynamicOptions({
        dynamicConfig: field.dynamicOptions,
        dependencies: dependencyValues,
      })
    : { options: field?.options ?? [], loading: false };

  // Memoize options to prevent unnecessary rerenders
  const options = useMemo(() => {
    // Use dynamic options if available, otherwise use static options
    if (field.dynamicOptions) {
      return dynamicOptions;
    }
    return field.options || [];
  }, [field.options, field.dynamicOptions, dynamicOptions]);

  // Convert value to array if it's a string (single select mode)
  const selectedValues = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  // Determine if all options are selected for parent checkbox state
  const allSelected = useMemo(() => {
    if (options.length === 0) return false;
    return options.every((option) => selectedValues.includes(option.value));
  }, [options, selectedValues]);

  // Determine if some options are selected (for indeterminate state)
  const someSelected = useMemo(() => {
    return selectedValues.length > 0 && !allSelected;
  }, [selectedValues, allSelected]);

  // Handle individual checkbox change
  const handleChange = (optionValue: string, checked: boolean) => {
    if (field.isMulti) {
      // Multi-select mode
      if (checked) {
        // Add to selected values
        onChange([...selectedValues, optionValue]);
      } else {
        // Remove from selected values
        onChange(selectedValues.filter((val) => val !== optionValue));
      }
    } else {
      // Single-select mode (radio-like behavior)
      onChange(checked ? optionValue : "");
    }

    // Call onBlur to trigger validation
    onBlur();
  };

  // Handle parent checkbox change
  const handleParentChange = (checked: boolean) => {
    if (checked) {
      // Select all options
      onChange(options.map((option) => option.value));
    } else {
      // Deselect all options
      onChange([]);
    }

    // Call onBlur to trigger validation
    onBlur();
  };

  return (
    <div className="flex flex-col space-y-2">
      {!!field?.optionsTitle && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-x-2">
              {field.isMulti && (
                <Checkbox
                  id={`${field?.optionsTitle}`}
                  name={field.name}
                  disabled={field.disabled || options.length === 0}
                  className={cn(
                    field.className,
                    !!error && touched ? "border-destructive" : ""
                  )}
                  checked={allSelected}
               
                  onCheckedChange={handleParentChange}
                  onBlur={onBlur}
                />
              )}
              <Label
                htmlFor={`${field?.optionsTitle}`}
                className="text-sm font-normal"
              >
                {field?.optionsTitle}
              </Label>
            </div>
            <CollapsibleTrigger>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}{" "}
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent>
            {loading && (
              <div className="flex items-center text-muted-foreground text-sm mt-2">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading options...
              </div>
            )}

            {options.map((option) => (
              <div
                key={option.value}
                className="flex items-center gap-x-2 ps-6 mt-2"
              >
                <Checkbox
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  checked={selectedValues.includes(option.value)}
                  disabled={field.disabled}
                  className={cn(
                    field.className,
                    !!error && touched ? "border-destructive" : ""
                  )}
                  onCheckedChange={(checked) =>
                    handleChange(option.value, !!checked)
                  }
                  onBlur={onBlur}
                />
                <Label
                  htmlFor={`${field.name}-${option.value}`}
                  className="text-sm font-normal"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Error message */}
      {!!error && touched && (
        <div className="text-destructive text-sm mt-1">
          {typeof error === "string" ? error : error}
        </div>
      )}
    </div>
  );
};

export default memo(CheckboxGroupField);
