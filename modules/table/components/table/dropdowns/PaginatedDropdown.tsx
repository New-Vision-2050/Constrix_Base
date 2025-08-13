import React, { useRef, useEffect, useState, useCallback } from "react";
import { Check, ChevronsUpDown, Loader2, Search, X } from "lucide-react";
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
import { DynamicDropdownConfig } from "@/modules/form-builder/types/formTypes";
import { useDropdownSearch } from "@/modules/table/hooks/useDropdownSearch";
import { useTranslations } from "next-intl";
import { Label } from "@/modules/table/components/ui/label";

interface PaginatedDropdownProps {
  columnKey: string;
  label: string;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string | string[]>;
  isMulti?: boolean;
  setFirstAsDefault?: boolean;
}

const PaginatedDropdown: React.FC<PaginatedDropdownProps> = ({
  columnKey,
  label,
  value,
  onChange,
  placeholder = "Select...",
  isDisabled = false,
  dynamicConfig,
  dependencies,
  isMulti = false,
  setFirstAsDefault = dynamicConfig?.setFirstAsDefault ?? false,
}) => {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { options, loading, error, dataFetched, fetchOptions, hasMore } =
    useDropdownSearch({
      searchTerm: searchValue,
      dynamicConfig,
      dependencies,
      selectedValue: value,
      isMulti,
    });

  // Set first option as default when options change and no value is selected
  useEffect(() => {
    if (
      setFirstAsDefault &&
      dataFetched &&
      options.length > 0 &&
      (!value || (isMulti && Array.isArray(value) && value.length === 0))
    ) {
      onChange(isMulti ? [options[0].value] : options[0].value);
    }
  }, [options, value, setFirstAsDefault, isMulti, onChange, dataFetched]);

  // Find the label(s) for the current value(s)
  const getSelectedLabels = () => {
    if (isMulti && Array.isArray(value)) {
      // For multi-select, return comma-separated labels
      return value
        .map((val) => {
          const option = options.find((opt) => {
            return opt.value == val && typeof opt.value == 'string';
          });
          
          return option ? option.label : val;
        })
        .join(", ");
    } else {
      // For single select
      const singleValue = value as string;
      const option = options.find((option) => option.value === singleValue);

      // If we have a proper label, use it
      if (option) {
        return option.label;
      }

      // If we're still loading and have a value, show loading indicator
      if (loading && singleValue) {
        return `(loading...)`;
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
    } else {
      // Clear search when dropdown closes
      //setSearchValue("");
    }
  }, [open]);


  return (
    <div className="space-y-2">
      {label && <Label className="mb-2 block">{label}</Label>}
      <Popover
        open={isDisabled ? false : open}
        onOpenChange={isDisabled ? undefined : setOpen}
      >
        <div className="flex gap-2">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label={label}
              disabled={isDisabled}
              className={cn(
                "w-full justify-between bg-sidebar whitespace-normal",
                (!value ||
                  (isMulti && Array.isArray(value) && value.length === 0)) &&
                  "text-muted-foreground",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onKeyDown={handleKeyDown}
            >
              <div className="flex-1 overflow-hidden text-ellipsis line-clamp-1 text-start">
                {value &&
                (!isMulti || (Array.isArray(value) && value.length > 0))
                  ? selectedLabel
                  : placeholder}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {(value && !isMulti) ||
          (isMulti && Array.isArray(value) && value.length > 0) ? (
            <Button
              variant="ghost"
              size="icon"
              disabled={isDisabled}
              className={cn(
                "h-auto w-8 p-1.5 hover:bg-transparent",
                isDisabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(isMulti ? [] : "");
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
            shouldFilter={false} // Disable client-side filtering
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
              ref={listRef}
              className="max-h-[200px] overflow-auto"
              onScroll={(event) => {
                const target = event.target as HTMLElement;
                let total = target.scrollTop + target.clientHeight;
                let content = target.querySelector(
                  `[id='inner-list']`
                ) as HTMLElement | null;
                if (
                  hasMore &&
                  !loading &&
                  total + 65 >= (content?.clientHeight || 0)
                ) {
                  fetchOptions(true);
                }
              }}
            >
              <CommandEmpty>
                {loading ? (
                  <div className="py-6 text-center text-sm">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading options...
                  </div>
                ) : error ? (
                  <div className="py-6 text-center text-sm text-destructive">
                    Error: {error}
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm">
                    {t("Main.NoResultsRound")}
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup id={"inner-list"}>
                {options.map((option, index) => (
                  <CommandItem
                    key={`${option.value}-${index}`}
                    value={option.value}
                    onSelect={() => {
                      if (isMulti) {
                        // For multi-select, toggle the selected value
                        const currentValues = Array.isArray(value) ? value : [];
                        const newValues = currentValues.includes(option.value)
                          ? currentValues.filter((v) => v !== option.value)
                          : [...currentValues, option.value];
                        onChange(newValues);
                        // Don't close the dropdown for multi-select
                      } else {
                        // For single select
                        onChange(option.value);
                        setOpen(false);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isMulti
                          ? Array.isArray(value) && value.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                          : value === option.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
                {loading && (
                  <div className="py-2 text-center text-sm text-muted-foreground">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Searching...
                    </div>
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default React.memo(PaginatedDropdown);
