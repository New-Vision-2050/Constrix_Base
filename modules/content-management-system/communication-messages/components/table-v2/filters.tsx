"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FiltersProps {
  searchQuery: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  t: (key: string) => string;
}

/**
 * Filters component for communication messages table
 * Provides search and status filtering capabilities
 */
export function TableFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onReset,
  t,
}: FiltersProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    const timer = setTimeout(() => onSearchChange(value), 500);
    return () => clearTimeout(timer);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search input */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={localSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
