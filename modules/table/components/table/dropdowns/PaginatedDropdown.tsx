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
import { DynamicDropdownConfig } from "@/modules/table/utils/tableTypes";
import { useDropdownSearch } from "@/modules/table/hooks/useDropdownSearch";

interface PaginatedDropdownProps {
  columnKey: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string>;
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
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { options, loading, error } = useDropdownSearch({
    searchTerm: searchValue,
    dynamicConfig,
    dependencies,
  });

  // Find the label for the current value
  const selectedLabel =
    options.find((option) => option.value === value)?.label || value;

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
      setSearchValue("");
    }
  }, [open]);

  return (
    <div>
      {!!label && (
        <label
          htmlFor={columnKey}
          className={cn("block text-sm font-medium text-gray-700 mb-2")}
        >
          {label}
        </label>
      )}{" "}
      <Popover open={open} onOpenChange={setOpen}>
        <div className="flex gap-2">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label={label}
              disabled={isDisabled}
              className={cn(
                "w-full justify-between bg-sidebar",
                !value && "text-muted-foreground"
              )}
              onKeyDown={handleKeyDown}
            >
              <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                {value ? selectedLabel : placeholder}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          {value && (
            <Button
              variant="ghost"
              size="icon"
              className="h-auto w-8 p-1.5 hover:bg-transparent"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange("");
              }}
            >
              <X className="h-4 w-4 opacity-50 hover:opacity-80" />
            </Button>
          )}
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
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                ref={inputRef}
                placeholder="Search..."
                value={searchValue}
                onValueChange={setSearchValue}
                className="flex-1 py-3 outline-none"
              />
            </div>
            <CommandList ref={listRef} className="max-h-[200px] overflow-auto">
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
                    No results found
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
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
