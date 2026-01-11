import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  t: (key: string) => string;
}

/**
 * Filters component for Founder table
 * Provides search functionality with debounce and reset button
 */
export function TableFilters({
  searchQuery,
  onSearchChange,
  onReset,
  t,
}: TableFiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Sync with parent when searchQuery changes externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearchChange(localSearch);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, onSearchChange]);

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* Search input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Reset button */}
      {searchQuery && (
        <Button variant="outline" size="sm" onClick={onReset}>
          <X className="h-4 w-4 mr-1" />
          {t("reset")}
        </Button>
      )}
    </div>
  );
}
