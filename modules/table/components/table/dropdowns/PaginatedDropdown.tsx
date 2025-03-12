import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Check, ChevronsUpDown, Loader2, Search, X } from 'lucide-react';
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
import { DynamicDropdownConfig } from '@/modules/table/utils/tableTypes';
import { useDropdownSearch } from '@/modules/table/hooks/useDropdownSearch';

interface PaginatedDropdownProps {
  columnKey: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isDisabled?: boolean;
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string>;
  enableServerSearch?: boolean; // Prop to enable/disable server-side search
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
  enableServerSearch = true, // Default to true (server-side search enabled)
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [cachedOptions, setCachedOptions] = useState<Array<{value: string, label: string}>>([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [isClientSearching, setIsClientSearching] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const previousOpenState = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Only fetch options when the dropdown is open AND server search is enabled
  // Simplified to make search more reliable
  const {
    options: fetchedOptions,
    loading: serverLoading,
    error
  } = useDropdownSearch({
    searchTerm: open && enableServerSearch ? searchValue : '',
    dynamicConfig: open && enableServerSearch ? dynamicConfig : undefined,
    dependencies: open && enableServerSearch ? dependencies : undefined
  });

  // Update cached options when new options are fetched and dropdown is open
  useEffect(() => {
    if (open && fetchedOptions.length > 0) {
      setCachedOptions(fetchedOptions);
      // Reset loading state after options are fetched
      setIsClientSearching(false);
    }
  }, [open, fetchedOptions]);

  // Client-side filtering with loading state
  const filteredOptions = useMemo(() => {
    // If no search term, return all cached options
    if (!searchValue.trim()) {
      setIsClientSearching(false);
      return cachedOptions;
    }
    
    // Apply client-side filtering
    const lowerSearchValue = searchValue.toLowerCase();
    const filtered = cachedOptions.filter(option =>
      option.label.toLowerCase().includes(lowerSearchValue) ||
      option.value.toLowerCase().includes(lowerSearchValue)
    );
    
    // After filtering is complete, set client searching to false
    // This is now handled in the handleSearchChange function
    
    return filtered;
  }, [searchValue, cachedOptions]);

  // Reset loading state when server loading completes
  useEffect(() => {
    if (!serverLoading && isClientSearching) {
      // Reset client searching state when server loading completes
      setIsClientSearching(false);
    }
  }, [serverLoading, isClientSearching]);

  // Determine if we're in a loading state
  const isLoading = useMemo(() => {
    // Only show loading if we're actually loading or searching
    return serverLoading || (isClientSearching && searchValue.trim().length > 0);
  }, [serverLoading, isClientSearching, searchValue]);

  // Find the label for the current value
  const selectedLabel = useMemo(() => {
    // First check in all cached options
    const foundInCached = cachedOptions.find(option => option.value === value);
    if (foundInCached) {
      return foundInCached.label;
    }
    
    // Then check in fetched options
    const foundInFetched = fetchedOptions.find(option => option.value === value);
    if (foundInFetched) {
      return foundInFetched.label;
    }
    
    // Check if we have a stored label in localStorage
    try {
      const storedLabels = localStorage.getItem(`dropdown-labels-${columnKey}`);
      if (storedLabels) {
        const labelsMap = JSON.parse(storedLabels);
        if (labelsMap[value]) {
          return labelsMap[value];
        }
      }
    } catch (e) {
      console.error('Error reading from localStorage:', e);
    }
    
    // Fall back to the value itself
    return value;
  }, [cachedOptions, fetchedOptions, value, columnKey]);

  // Use filtered options or fetched options
  const displayOptions = useMemo(() => {
    let options = [];
    
    // If server-side search is enabled and we should fetch, use fetched options
    if (enableServerSearch && shouldFetch) {
      options = fetchedOptions;
    } else {
      // Otherwise use our client-side filtered options
      options = filteredOptions;
    }
    
    // If we have a selected value, make sure it's always included in the options
    if (value && value.trim() !== '') {
      const selectedOption = {
        value: value,
        label: selectedLabel
      };
      
      // Check if the selected value is already in the options
      const valueExists = options.some(option => option.value === value);
      
      // If not, add it to the beginning of the options
      if (!valueExists) {
        options = [selectedOption, ...options];
      }
    }
    
    return options;
  }, [enableServerSearch, fetchedOptions, shouldFetch, filteredOptions, value, selectedLabel]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!open) return;

    // If user presses alphanumeric keys, focus on the search input and add the key
    if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [open]);

  // Handle dropdown open/close
  useEffect(() => {
    if (open) {
      // When dropdown opens, don't fetch automatically
      // Only fetch when user starts typing
      setShouldFetch(false);
      setIsClientSearching(false);
      
      // Focus the search input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else if (previousOpenState.current) {
      // When dropdown closes, don't clear the search term
      // This prevents losing the search context
      
      // Disable fetching when dropdown is closed
      setShouldFetch(false);
      // Make sure loading state is cleared when dropdown closes
      setIsClientSearching(false);
      
      // Clear any pending search timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    }

    // Update previous open state
    previousOpenState.current = open;
  }, [open]);

  // Handle search value change - trigger search when user types or clears
  const handleSearchChange = useCallback((value: string) => {
    // Update search value immediately
    setSearchValue(value);
    
    if (enableServerSearch) {
      // Trigger a search in two cases:
      // 1. When the search term is completely empty (to fetch all results)
      // 2. When the search term has at least 3 characters
      if (value.trim().length === 0 || value.trim().length > 2) {
        setShouldFetch(true);
        setIsClientSearching(true);
      } else {
        // For short searches (1-2 characters), don't trigger API requests
        setShouldFetch(false);
        setIsClientSearching(value.trim().length > 0);
      }
    } else {
      // For client-side filtering, just update the searching state
      setIsClientSearching(value.trim().length > 0);
    }
  }, [enableServerSearch]);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div>
      <label
        htmlFor={columnKey}
        className={cn(
          "block text-sm font-medium text-gray-700 mb-2"
        )}
      >
        {label}
      </label>
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
                "w-full justify-between",
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
                // Clear the selected value
                onChange('');
                // Also clear the search term
                setSearchValue('');
                // Trigger a fetch to get all options
                if (enableServerSearch) {
                  setShouldFetch(true);
                  setIsClientSearching(true);
                }
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
            shouldFilter={false} // We handle filtering ourselves
          >
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                ref={inputRef}
                placeholder="Search..."
                value={searchValue}
                onValueChange={handleSearchChange}
                className="flex-1 py-3 outline-none"
              />
            </div>
            <CommandList
              ref={listRef}
              className="max-h-[200px] overflow-auto"
            >
              <CommandEmpty>
                {isLoading ? (
                  <div className="py-6 text-center text-sm">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    Loading options...
                  </div>
                ) : error ? (
                  <div className="py-6 text-center text-sm text-destructive">
                    Error: {error}
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm">No results found</div>
                )}
              </CommandEmpty>
              
              <CommandGroup>
                {displayOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      // Store the label for this value in localStorage
                      try {
                        const storedLabels = localStorage.getItem(`dropdown-labels-${columnKey}`) || '{}';
                        const labelsMap = JSON.parse(storedLabels);
                        labelsMap[option.value] = option.label;
                        localStorage.setItem(`dropdown-labels-${columnKey}`, JSON.stringify(labelsMap));
                      } catch (e) {
                        console.error('Error writing to localStorage:', e);
                      }
                      
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
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default React.memo(PaginatedDropdown);
