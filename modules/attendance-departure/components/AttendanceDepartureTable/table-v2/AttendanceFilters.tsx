"use client";
import React, { useMemo, useState } from "react";
import { Box, TextField, Button, Stack, Autocomplete, Typography } from "@mui/material";
import { Search, Refresh, Map } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { AttendanceFiltersProps, DropdownOption } from "./types";
import { useQuery } from "@tanstack/react-query";
import { fetchDropdownOptions } from "./api";
import { baseURL } from "@/config/axios-config";
import { Constraint } from "@/modules/attendance-departure/api/getConstraints";
import { useAttendance } from "@/modules/attendance-departure/context/AttendanceContext";

/**
 * Filters component for attendance table search functionality
 */
export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const t = useTranslations("AttendanceDepartureModule.Table.filters");
  const [searchInput, setSearchInput] = useState("");

  const { toggleView } = useAttendance();

  // Fetch branches for dropdown
  const { data: branches = [] } = useQuery<DropdownOption[]>({
    queryKey: ["branches"],
    queryFn: () =>
      fetchDropdownOptions(`${baseURL}/management_hierarchies/list`),
  });

  // Fetch managements for dropdown
  const { data: managements = [] } = useQuery<DropdownOption[]>({
    queryKey: ["managements"],
    queryFn: () =>
      fetchDropdownOptions(
        `${baseURL}/management_hierarchies/list?type=management`
      ),
  });

  // Fetch constraints for dropdown
  const { data: constraints = [] } = useQuery<Constraint[]>({
    queryKey: ["constraints"],
    queryFn: () => fetchDropdownOptions(`${baseURL}/attendance/constraints`),
  });
  const constraintsOptions = useMemo(
    () => constraints?.map((c) => ({ id: c.id, name: c.constraint_name })),
    [constraints]
  );

  const handleSearchClick = () => {
    onFilterChange({ ...filters, search_text: searchInput });
  };

  return (
    <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1, mb: 2 }}>
      <Stack spacing={2}>
        {/* search title */}
        <Typography variant="h6">{t("searchTitle")}</Typography>
        {/* Grid layout for filters - 3 items per row on md+, 1 item on mobile */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
          }}
        >
          {/* Search text field */}
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder={t("searchPlaceholder")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearchClick()}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />

          {/* Branch filter */}
          <Autocomplete
            fullWidth
            size="small"
            options={branches}
            getOptionLabel={(option) => option.name}
            value={branches.find((b) => b.id === filters.branch_id) || null}
            onChange={(_, value) =>
              onFilterChange({ ...filters, branch_id: value?.id || "" })
            }
            renderInput={(params) => (
              <TextField {...params} placeholder={t("branchPlaceholder")} />
            )}
          />

          {/* Management filter */}
          <Autocomplete
            fullWidth
            size="small"
            options={managements}
            getOptionLabel={(option) => option.name}
            value={
              managements.find((m) => m.id === filters.management_id) || null
            }
            onChange={(_, value) =>
              onFilterChange({ ...filters, management_id: value?.id || "" })
            }
            renderInput={(params) => (
              <TextField {...params} placeholder={t("managementPlaceholder")} />
            )}
          />

          {/* Constraint filter */}
          <Autocomplete
            fullWidth
            size="small"
            options={constraintsOptions}
            getOptionLabel={(option) => option.name}
            value={
              constraintsOptions.find((c) => c.id === filters.constraint_id) ||
              null
            }
            onChange={(_, value) =>
              onFilterChange({ ...filters, constraint_id: value?.id || "" })
            }
            renderInput={(params) => (
              <TextField {...params} placeholder={t("constraintPlaceholder")} />
            )}
          />

          {/* Start Date filter */}
          <TextField
            type="date"
            size="small"
            label={t("startDate")}
            value={filters.start_date || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, start_date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />

          {/* End Date filter */}
          <TextField
            type="date"
            size="small"
            label={t("endDate")}
            value={filters.end_date || ""}
            onChange={(e) =>
              onFilterChange({ ...filters, end_date: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        {/* Action buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="contained"
            startIcon={<Map />}
            onClick={() => toggleView("map")}
          >
            {t("mapView")}
          </Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={onReset}>
            {t("reset") || "Reset"}
          </Button>
          <Button
            variant="contained"
            startIcon={<Search />}
            onClick={handleSearchClick}
          >
            {t("search") || "Search"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
