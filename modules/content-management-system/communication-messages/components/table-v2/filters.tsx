"use client";

import { useState, useEffect } from "react";
import { Search, Refresh } from "@mui/icons-material";
import { Box, TextField, Button, Stack } from "@mui/material";
import { useDebouncedValue } from "@/modules/table/hooks/useDebounce";

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
 * Provides search and status filtering capabilities using MUI components
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
  const debouncedSearch = useDebouncedValue(localSearch, 500);

  // Sync with parent when searchQuery changes externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Call onSearchChange when debounced value changes
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      onSearchChange(debouncedSearch);
    }
  }, [debouncedSearch, searchQuery, onSearchChange]);

  return (
    <Box sx={{ mb: 2 }}>
      <Stack spacing={2}>
        {/* Filter Controls */}
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Search input */}
          <TextField
            size="small"
            placeholder={t("searchPlaceholder")}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "action.active" }} />
              ),
            }}
            sx={{ flexGrow: 1 }}
          />
        </Stack>
      </Stack>
    </Box>
  );
}
