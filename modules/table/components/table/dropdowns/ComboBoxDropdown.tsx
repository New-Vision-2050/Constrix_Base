import React from "react";
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
}) => {
  const { localValue, handleSelect } = useDropdownState({
    initialValue: value,
    onChange,
  });

  const shouldBeDisabled =
    isDisabled ||
    ((dynamicConfig?.dependsOn &&
      (!dependencies || !dependencies[dynamicConfig.dependsOn])) as boolean);

  const dependencyMessage = useDependencyMessage(
    shouldBeDisabled,
    dynamicConfig?.dependsOn
  );

  // Convert options to react-select format
  const selectOptions = options.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  // Find current value option
  const selectedOption =
    selectOptions.find((opt) => opt.value === localValue) || null;

  return (
    <div className="space-y-2">
      {!!label && (
        <Label
          htmlFor={`select-${columnKey}`}
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </Label>
      )}{" "}
      <Select
        id={`select-${columnKey}`}
        value={selectedOption}
        onChange={(newValue: any) => handleSelect(newValue?.value || "")}
        options={selectOptions}
        isDisabled={shouldBeDisabled}
        placeholder={placeholder}
        isClearable
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
              ? "bg-primary text-primary-foreground font-medium"
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
