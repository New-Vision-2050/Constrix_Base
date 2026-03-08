import { Search, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  t: (key: string) => string;
  setAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
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
  setAddDialogOpen
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
    <Box sx={{ mb: 2 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        {/* Search input */}
        <TextField
          size="small"
          placeholder={t("searchPlaceholder")}
          value={localSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocalSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <Box component="span" sx={{ mr: 1, display: 'flex' }}>
                <Search size={16} style={{ color: 'rgba(0, 0, 0, 0.54)' }} />
              </Box>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />

        {/* Add button */}
        <Can check={[PERMISSIONS.CMS.founder.create]}>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => setAddDialogOpen(true)}
          >
            {t("addFounder")}
          </Button>
        </Can>
      </Stack>
    </Box>
  );
}
