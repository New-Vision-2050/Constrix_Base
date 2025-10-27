import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface CheckboxOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  className?: string;
  disabled?: boolean;
  title?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
  className = "",
  disabled = false,
  title,
}) => {
  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (checked) {
      // Add to selected values
      onChange([...selectedValues, value]);
    } else {
      // Remove from selected values
      onChange(selectedValues.filter((v) => v !== value));
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <h4 className="text-sm font-medium text-foreground mb-2">{title}</h4>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center space-x-2 rtl:space-x-reverse">
            <Checkbox
              id={option.id}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) =>
                handleCheckboxChange(option.value, checked as boolean)
              }
              disabled={disabled || option.disabled}
              className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label
              htmlFor={option.id}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                "cursor-pointer select-none",
                (disabled || option.disabled) && "opacity-50 cursor-not-allowed"
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckboxGroup;
