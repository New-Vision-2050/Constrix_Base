"use client";

import React, { useMemo } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Autocomplete,
  Typography,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Search, Refresh, Map } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { AttendanceFiltersProps, DropdownOption } from "./types";
import {
  fetchBranchOptions,
  fetchManagementOptions,
} from "./api";
import { usePaginatedConstraintOptions } from "./usePaginatedConstraintOptions";
import { useAttendance } from "@/modules/attendance-departure/context/AttendanceContext";
import { syncTableFiltersToContext } from "./syncTableFiltersToContext";

/**
 * Filters component for attendance table search functionality
 */
export const AttendanceFilters: React.FC<AttendanceFiltersProps> = ({
  filters,
  onFilterChange,
  onSearch,
  onReset,
}) => {
  const t = useTranslations("AttendanceDepartureModule.Table.filters");
  const {
    toggleView,
    setStartDate,
    setEndDate,
    setSearchText,
    setSelectedBranch,
    setSelectedDepartment,
    setSelectedApprover,
    setSelectedAttendanceStatus,
  } = useAttendance();

  const { data: branches = [], isLoading: branchesLoading } = useQuery<
    DropdownOption[]
  >({
    queryKey: ["attendance-filter-branches"],
    queryFn: fetchBranchOptions,
    staleTime: 5 * 60 * 1000,
  });

  const { data: managements = [], isLoading: managementsLoading } = useQuery<
    DropdownOption[]
  >({
    queryKey: ["attendance-filter-managements"],
    queryFn: fetchManagementOptions,
    staleTime: 5 * 60 * 1000,
  });

  const {
    options: constraintsOptions,
    isLoading: constraintsLoading,
    isFetchingNextPage: constraintsFetchingNextPage,
    listboxSlotProps: constraintsListboxSlotProps,
  } = usePaginatedConstraintOptions();

  const branchValue = useMemo(
    () =>
      branches.find((b) => b.id === String(filters.branch_id ?? "")) ?? null,
    [branches, filters.branch_id],
  );

  const managementValue = useMemo(
    () =>
      managements.find((m) => m.id === String(filters.management_id ?? "")) ??
      null,
    [managements, filters.management_id],
  );

  const constraintValue = useMemo(
    () =>
      constraintsOptions.find(
        (c) => c.id === String(filters.constraint_id ?? ""),
      ) ?? null,
    [constraintsOptions, filters.constraint_id],
  );

  const handleMapClick = () => {
    syncTableFiltersToContext(filters, {
      setStartDate,
      setEndDate,
      setSearchText,
      setSelectedBranch,
      setSelectedDepartment,
      setSelectedApprover,
      setSelectedAttendanceStatus,
    });
    onSearch();
    toggleView("map");
  };

  return (
    <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 1, mb: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">{t("searchTitle")}</Typography>

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
          <TextField
            fullWidth
            size="small"
            variant="outlined"
            placeholder={t("searchPlaceholder")}
            value={filters.search_text ?? ""}
            onChange={(e) =>
              onFilterChange({ ...filters, search_text: e.target.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          />

          <Autocomplete
            fullWidth
            size="small"
            loading={branchesLoading}
            options={branches}
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={branchValue}
            onChange={(_, value) =>
              onFilterChange({
                ...filters,
                branch_id: value?.id != null ? String(value.id) : "",
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("branchPlaceholder")}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {branchesLoading ? (
                        <CircularProgress color="inherit" size={16} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Autocomplete
            fullWidth
            size="small"
            loading={managementsLoading}
            options={managements}
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={managementValue}
            onChange={(_, value) =>
              onFilterChange({
                ...filters,
                management_id: value?.id != null ? String(value.id) : "",
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("managementPlaceholder")}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {managementsLoading ? (
                        <CircularProgress color="inherit" size={16} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Autocomplete
            fullWidth
            size="small"
            loading={constraintsLoading || constraintsFetchingNextPage}
            options={constraintsOptions}
            filterOptions={(options) => options}
            getOptionLabel={(option) => option.name}
            getOptionKey={(option) => option.id}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={constraintValue}
            slotProps={{
              listbox: constraintsListboxSlotProps,
            }}
            ListboxProps={{
              onScroll: constraintsListboxSlotProps.onScroll,
              style: { maxHeight: 280, overflow: "auto" },
            }}
            onChange={(_, value) =>
              onFilterChange({
                ...filters,
                constraint_id: value?.id != null ? String(value.id) : "",
              })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("constraintPlaceholder")}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {constraintsLoading || constraintsFetchingNextPage ? (
                        <CircularProgress color="inherit" size={16} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <TextField
            fullWidth
            select
            size="small"
            label={t("attendanceStatus")}
            value={filters.attendance_status ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              onFilterChange({
                ...filters,
                attendance_status: v || undefined,
              });
            }}
          >
            <MenuItem value="">{t("attendanceStatusAll")}</MenuItem>
            <MenuItem value="holiday">{t("statusHoliday")}</MenuItem>
            <MenuItem value="absent">{t("statusAbsent")}</MenuItem>
            <MenuItem value="late">{t("statusLate")}</MenuItem>
            <MenuItem value="present">{t("statusPresent")}</MenuItem>
          </TextField>

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

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="contained" startIcon={<Map />} onClick={handleMapClick}>
            {t("mapView")}
          </Button>
          <Button variant="outlined" startIcon={<Refresh />} onClick={onReset}>
            {t("reset")}
          </Button>
          <Button variant="contained" startIcon={<Search />} onClick={onSearch}>
            {t("search")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};
