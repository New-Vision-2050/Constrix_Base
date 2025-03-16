import React, { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/modules/table/components/ui/button";
import { Input } from "@/modules/table/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/modules/table/components/ui/popover";
import { Checkbox } from "@/modules/table/components/ui/checkbox";
import { Label } from "@/modules/table/components/ui/label";
import { SearchConfig } from "@/modules/table/utils/tableTypes";
import { useDebounce } from "@/modules/table/hooks/useDebounce";
import { useTranslations } from "next-intl";

interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string, fields?: string[]) => void;
  searchConfig: SearchConfig;
  searchableColumns: { key: string; label: string }[];
  actions?: React.ReactNode; // Prop for custom actions
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearch,
  searchConfig,
  searchableColumns,
  actions,
}) => {
  const t = useTranslations();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [selectedSearchColumns, setSelectedSearchColumns] = useState<string[]>(
    searchConfig.defaultFields || []
  );

  useEffect(() => {
    // Initialize selectedSearchColumns with all searchable columns if not provided in config
    if (
      searchableColumns.length > 0 &&
      selectedSearchColumns.length === 0 &&
      searchConfig.allowFieldSelection
    ) {
      setSelectedSearchColumns(searchableColumns.map((col) => col.key));
    }
  }, [
    searchableColumns,
    selectedSearchColumns.length,
    searchConfig.allowFieldSelection,
  ]);

  // Create the debounced search function
  const debouncedSearch = useDebounce((query: string) => {
    // Only pass fields if column selection is allowed
    const fieldsToPass = searchConfig.allowFieldSelection
      ? selectedSearchColumns
      : searchConfig.defaultFields;

    onSearch(query, fieldsToPass);
  }, 500);

  // Handle input change and update local state, then trigger debounced search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setLocalSearchQuery("");
    onSearch("");
  };

  const toggleSearchColumn = (columnKey: string) => {
    if (!searchConfig.allowFieldSelection) return;

    setSelectedSearchColumns((prev) => {
      if (prev.includes(columnKey)) {
        return prev.filter((key) => key !== columnKey);
      } else {
        return [...prev, columnKey];
      }
    });
  };

  const selectAllSearchColumns = () => {
    if (!searchConfig.allowFieldSelection) return;
    setSelectedSearchColumns(searchableColumns.map((col) => col.key));
  };

  const clearAllSearchColumns = () => {
    if (!searchConfig.allowFieldSelection) return;
    setSelectedSearchColumns([]);
  };

  if (searchableColumns.length === 0) return null;

  return (
    <div className="flex p-5 flex-wrap items-center gap-3 mb-4 ">
      <div className="flex grow items-center space-x-2">
        <div className="relative w-full">
          <Search className="absolute  start-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("Table.Search")}
            value={localSearchQuery}
            onChange={handleInputChange}
            className="w-full pl-8 pr-10"
          />
          {localSearchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchConfig.allowFieldSelection && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="flex-shrink-0 bg-sidebar"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">
                    {t("Table.FilterSearch")}
                  </h4>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={selectAllSearchColumns}
                    >
                      All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={clearAllSearchColumns}
                    >
                      None
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {searchableColumns.map((column) => (
                    <div
                      key={column.key}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`filter-${column.key}`}
                        checked={selectedSearchColumns.includes(column.key)}
                        onCheckedChange={() => toggleSearchColumn(column.key)}
                      />
                      <Label
                        htmlFor={`filter-${column.key}`}
                        className="text-sm cursor-pointer"
                      >
                        {column.label}
                      </Label>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    {selectedSearchColumns.length} of {searchableColumns.length}{" "}
                    columns selected
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Custom actions area */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default SearchBar;
