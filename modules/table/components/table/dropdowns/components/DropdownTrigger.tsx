
import React from 'react';
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/modules/table/components/ui/button";
import { DropdownOption } from "@/modules/table/utils/tableTypes";

interface DropdownTriggerProps {
  selectedOption?: DropdownOption;
  localValue: string;
  placeholder: string;
  isDisabled: boolean;
  open?: boolean;
}

const DropdownTrigger = React.forwardRef<HTMLButtonElement, DropdownTriggerProps>(({
  selectedOption,
  localValue,
  placeholder,
  isDisabled,
  open
}, ref) => {
  return (
    <Button
      variant="outline"
      role="combobox"
      aria-expanded={open !== undefined ? open : false}
      className="w-full justify-between bg-background"
      disabled={isDisabled}
      ref={ref}
    >
      {localValue ? (
        selectedOption ? selectedOption.label : localValue
      ) : (
        <span className="text-muted-foreground">
          {placeholder}
        </span>
      )}
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );
});

DropdownTrigger.displayName = "DropdownTrigger";

// Using React.memo with custom comparison function to ensure proper re-renders
export default React.memo(DropdownTrigger, (prevProps, nextProps) => {
  // Force re-render if any of these props change
  return (
    prevProps.selectedOption?.value === nextProps.selectedOption?.value &&
    prevProps.localValue === nextProps.localValue &&
    prevProps.isDisabled === nextProps.isDisabled &&
    prevProps.open === nextProps.open
  );
});
