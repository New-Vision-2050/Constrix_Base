"use client";

/**
 * Coupon Table Filters
 * Search and filter controls for the coupon table
 */

import { useState, useEffect } from "react";
import { Search, Refresh } from "@mui/icons-material";
import { Box, TextField, Button, Stack } from "@mui/material";
import { useDebouncedValue } from "@/modules/table/hooks/useDebounce";
import Can from "@/lib/permissions/client/Can";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import DialogTrigger from "@/components/headless/dialog-trigger";
import { CouponDialog } from "@/modules/stores/components/dialogs/add-coupons";

interface FiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  onRefetch?: () => void;
  t: (key: string) => string;
}

/**
 * Filters component for coupon table
 * Provides search capabilities using MUI components
 */
export function TableFilters({
  searchQuery,
  onSearchChange,
  onReset,
  onRefetch,
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
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Search input */}
          <TextField
            size="small"
            placeholder={t("coupon.searchPlaceholder")}
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            sx={{ minWidth: 300, flexGrow: 1 }}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          {/* Reset button */}
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onReset}
            disabled={searchQuery === ""}
          >
            {t("labels.reset")}
          </Button>

          {/* add coupon button */}
          <Can check={[PERMISSIONS.ecommerce.coupon.create]}>
            <DialogTrigger
              component={CouponDialog}
              dialogProps={{ 
                onSuccess: () => {
                  onRefetch?.();
                } 
              }}
              render={({ onOpen }) => (
                <Button onClick={onOpen}>{t("coupon.addCoupon")}</Button>
              )}
            />
          </Can>
        </Stack>
      </Stack>
    </Box>
  );
}
