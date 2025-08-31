import React, { useEffect } from "react";
import Select from "react-select";
import { useDropdownState } from "./hooks/useDropdownState";
import { useDependencyMessage } from "./DropdownUtils";
import { type DropdownBaseProps } from "./DropdownUtils";
import { Label } from "@/modules/table/components/ui/label";

const ComboBoxDropdown: React.FC<DropdownBaseProps> = ({
  columnKey,
  label,
  value,
  onChange,
  options = [],
  isDisabled = false,
  dynamicConfig,
  dependencies,
  placeholder = "Select option",
  isMulti = false,
}) => {
  const { localValue, handleSelect } = useDropdownState({
    initialValue: value,
    onChange,
    isMulti,
  });

  const shouldBeDisabled = (() => {
    if (isDisabled) return true;
    if (!dynamicConfig?.dependsOn || !dependencies) return false;

    // Case 1: String format (backward compatibility)
    if (typeof dynamicConfig.dependsOn === 'string') {
      return !dependencies[dynamicConfig.dependsOn];
    }

    // Case 2: Array of dependency configs
    if (Array.isArray(dynamicConfig.dependsOn)) {
      return dynamicConfig.dependsOn.some(
        depConfig => !dependencies[depConfig.field] || dependencies[depConfig.field] === ""
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

  const dependencyMessage = useDependencyMessage(
    shouldBeDisabled,
    dynamicConfig?.dependsOn
  );

  // Convert options to react-select format
  const selectOptions = options.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  // Auto-select all options if selectAll is enabled
  useEffect(() => {
    if (
      dynamicConfig?.selectAll &&
      isMulti &&
      options.length > 0 &&
      (!localValue || (Array.isArray(localValue) && localValue.length === 0))
    ) {
      const allValues = options.map(option => option.value);
      handleSelect(allValues);
    }
  }, [options, localValue, dynamicConfig?.selectAll, isMulti, handleSelect]);

  // Find current value option(s)
  const selectedOption = isMulti
    ? selectOptions.filter((opt) =>
        Array.isArray(localValue) && localValue.includes(opt.value)
      )
    : selectOptions.find((opt) => opt.value == localValue) || null;

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={`select-${columnKey}`} className="mb-2 block">{label}</Label>}
      <Select
        id={`select-${columnKey}`}
        value={selectedOption}
        onChange={(newValue: any) => {
          if (isMulti) {
            // For multi-select, extract array of values
            const values = newValue ? newValue.map((item: any) => item.value) : [];
            handleSelect(values);
          } else {
            // For single select
            handleSelect(newValue?.value || "");
          }
        }}
        options={selectOptions}
        isMulti={isMulti}
        isDisabled={shouldBeDisabled}
        placeholder={placeholder}
        isClearable
        menuPortalTarget={document.body}
        classNames={{
          control: (state) =>
            "bg-sidebar border border-input hover:border-ring rounded-md shadow-sm transition-colors " +
            (state.isFocused
              ? "border-primary ring-2 ring-primary/20 ring-offset-1"
              : ""),
          menu: () =>
            "bg-background border border-input rounded-md shadow-lg mt-1 py-1 z-50",
          menuList: () => "py-1 max-h-60",
          option: (state) =>
            "cursor-pointer px-3 py-2 text-sm transition-colors " +
            (state.isFocused ? "bg-accent text-accent-foreground" : "") +
            (state.isSelected
              ? "bg-primary text-black dark:text-white font-medium"
              : ""),
          singleValue: () => "text-foreground",
          input: () => "text-foreground",
          placeholder: () => "text-muted-foreground",
          indicatorSeparator: () => "bg-input",
          dropdownIndicator: (state) =>
            "text-muted-foreground hover:text-foreground transition-colors p-1 " +
            (state.isFocused ? "text-primary" : ""),
          clearIndicator: () =>
            "text-muted-foreground hover:text-foreground p-1 rounded-md hover:bg-accent/50 transition-colors",
          valueContainer: () => "gap-1 px-3 py-1.5",
          noOptionsMessage: () => "text-muted-foreground p-2 text-sm",
          menuPortal: () => `!z-[9999]`,
        }}
        unstyled
        className="min-w-[200px]"
      />
      {dependencyMessage && (
        <p className="text-xs text-muted-foreground">{dependencyMessage}</p>
      )}
    </div>
  );
};

export default ComboBoxDropdown;
