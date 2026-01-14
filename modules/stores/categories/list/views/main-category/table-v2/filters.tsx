import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import DialogTrigger from "@/components/headless/dialog-trigger";
import AddCategoryDialog from "@/modules/stores/components/dialogs/add-category";

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  t: (key: string) => string;
  setAddDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: () => void;
}

/**
 * Filters component for Main Categories table
 * Provides search functionality with debounce and add button
 * Uses MUI components for consistent UI
 */
export function TableFilters({
  searchQuery,
  onSearchChange,
  onReset,
  t,
  setAddDialogOpen,
  refetch,
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
          placeholder={t("table.search")}
          value={localSearch}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setLocalSearch(e.target.value)
          }
          InputProps={{
            startAdornment: (
              <Box component="span" sx={{ mr: 1, display: "flex" }}>
                <Search size={16} style={{ color: "rgba(0, 0, 0, 0.54)" }} />
              </Box>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />

        {/* Add category button */}
        <Can check={[PERMISSIONS.ecommerce.category.create]}>
          <DialogTrigger
            component={AddCategoryDialog}
            dialogProps={{ onSuccess: refetch }}
            render={({ onOpen }) => (
              <Button variant="contained" onClick={onOpen}>
                {t("table.add")}
              </Button>
            )}
          />
        </Can>
      </Stack>
    </Box>
  );
}
