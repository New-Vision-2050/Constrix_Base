import React, { useEffect, useState, useCallback, useRef } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/modules/table/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/modules/table/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/table/components/ui/popover";
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

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const shouldBeDisabled = (() => {
    if (isDisabled) return true;
    if (!dynamicConfig?.dependsOn || !dependencies) return false;

    // Case 1: String format (backward compatibility)
    if (typeof dynamicConfig.dependsOn === "string") {
      return !dependencies[dynamicConfig.dependsOn];
    }

    // Case 2: Array of dependency configs
    if (Array.isArray(dynamicConfig.dependsOn)) {
      return dynamicConfig.dependsOn.some(
        (depConfig) =>
          !dependencies[depConfig.field] || dependencies[depConfig.field] == ""
      );
    }

    // Case 3: Object with field names as keys
    if (typeof dynamicConfig.dependsOn === "object") {
      return Object.keys(dynamicConfig.dependsOn).some(
        (field) => !dependencies[field]
      );
    }

    return false;
  })();

  const dependencyMessage = useDependencyMessage(
    shouldBeDisabled,
    dynamicConfig?.dependsOn
  );

  // Auto-select all options if selectAll is enabled
  useEffect(() => {
    if (
      dynamicConfig?.selectAll &&
      isMulti &&
      options.length > 0 &&
      (!localValue || (Array.isArray(localValue) && localValue.length === 0))
    ) {
      const allValues = options.map((option) => option.value);
      handleSelect(allValues);
    }
  }, [options, localValue, dynamicConfig?.selectAll, isMulti, handleSelect]);

  // Find the label(s) for the current value(s)
  const getSelectedLabels = () => {
    if (isMulti && Array.isArray(localValue)) {
      // For multi-select, return comma-separated labels
      return localValue
        .map((val) => {
          const option = options.find((opt) => {
            return opt.value == val && typeof opt.value == "string";
          });

          return option ? option.label : val;
        })
        .join(", ");
    } else {
      // For single select
      const singleValue = localValue as string;
      const option = options.find((option) => option.value == singleValue);

      // If we have a proper label, use it
      if (option) {
        return option.label;
      }

      // Fallback to the value itself
      return singleValue;
    }
  };

  const selectedLabel = getSelectedLabels();

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return;

      // If user presses alphanumeric keys, focus on the search input and add the key
      if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    },
    [open]
  );

  // Focus the search input when dropdown opens
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [open]);

  // Filter options based on search value
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="space-y-2">
      {label && <Label className="mb-2 block">{label}</Label>}
      <Popover
        open={shouldBeDisabled ? false : open}
        onOpenChange={shouldBeDisabled ? undefined : setOpen}
      >
        <div className="flex gap-2">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label={label}
              disabled={shouldBeDisabled}
              className={cn(
                "w-full justify-between bg-sidebar whitespace-normal",
                (!localValue ||
                  (isMulti &&
                    Array.isArray(localValue) &&
                    localValue.length === 0)) &&
                  "text-muted-foreground",
                shouldBeDisabled && "opacity-50 cursor-not-allowed"
              )}
              onKeyDown={handleKeyDown}
            >
              <div className="flex-1 overflow-hidden text-ellipsis line-clamp-1 text-start">
                {localValue &&
                (!isMulti ||
                  (Array.isArray(localValue) && localValue.length > 0))
                  ? selectedLabel
                  : placeholder}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {(localValue && !isMulti) ||
          (isMulti && Array.isArray(localValue) && localValue.length > 0) ? (
            <Button
              variant="ghost"
              size="icon"
              disabled={shouldBeDisabled}
              className={cn(
                "h-auto w-8 p-1.5 hover:bg-transparent",
                shouldBeDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelect(isMulti ? [] : "");
                setSearchValue("");
              }}
            >
              <X className="h-4 w-4 opacity-50 hover:opacity-80" />
            </Button>
          ) : null}
        </div>
        <PopoverContent
          className="w-[250px] p-0"
          sideOffset={8}
          side="bottom"
          align="start"
        >
          <Command
            data-dropdown-id={columnKey}
            className="w-full"
            shouldFilter={false}
          >
            <div className="flex items-center border-b px-3">
              <CommandInput
                ref={inputRef}
                placeholder="بحث..."
                value={searchValue}
                onValueChange={setSearchValue}
                className="flex-1 py-3 px-1 outline-none"
              />
            </div>
            <CommandList
              onWheel={(e) => e.stopPropagation()}
              className="max-h-[200px] overflow-auto"
            >
              <CommandEmpty>
                <div className="py-6 text-center text-sm">No results found</div>
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option, index) => (
                  <CommandItem
                    key={`${option.value}-${index}`}
                    value={option.value}
                    onSelect={() => {
                      if (isMulti) {
                        // For multi-select, toggle the selected value
                        const currentValues = Array.isArray(localValue)
                          ? localValue
                          : [];
                        const newValues = currentValues.includes(option.value)
                          ? currentValues.filter((v) => v != option.value)
                          : [...currentValues, option.value];
                        handleSelect(newValues);
                        // Don't close the dropdown for multi-select
                      } else {
                        // For single select
                        handleSelect(option.value);
                        setOpen(false);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isMulti
                          ? Array.isArray(localValue) &&
                            localValue.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                          : localValue == option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {dependencyMessage && (
        <p className="text-xs text-muted-foreground">{dependencyMessage}</p>
      )}
    </div>
  );
};

export default ComboBoxDropdown;
