"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { AttendanceStatusRecord } from "@/modules/attendance-departure/types/attendance";
import { AttendanceFilters } from "./AttendanceFilters";
import { getAttendanceColumns } from "./columns";
import { fetchAttendanceData } from "./api";
import { useAttendance } from "../../../context/AttendanceContext";
import { AttendanceFilterParams } from "./types";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { ColumnDef } from "@/components/headless/table";
import { useDebouncedValue } from "@/modules/table/hooks/useDebounce";
import {
  attendanceFiltersQueryKey,
  defaultAttendanceFilters,
  normalizeAttendanceFilters,
  syncTableFiltersToContext,
} from "./syncTableFiltersToContext";

const AttendanceTable = HeadlessTableLayout<AttendanceStatusRecord>();
const SEARCH_DEBOUNCE_MS = 400;

function getAttendanceRowId(row: AttendanceStatusRecord): string {
  return `${row.user?.id ?? "unknown"}-${row.work_date}-${row.id}`;
}

/**
 * Main attendance table component using headless table pattern
 */
export const AttendanceTableV2: React.FC = () => {
  const t = useTranslations("AttendanceDepartureModule.Table");
  const attendanceContext = useAttendance();
  const { can } = usePermissions();

  const [filters, setFilters] = useState<AttendanceFilterParams>(() =>
    defaultAttendanceFilters(),
  );
  /** When true, search uses live input instead of debounced value (Search button / Enter). */
  const [searchImmediate, setSearchImmediate] = useState(false);

  const debouncedSearchText = useDebouncedValue(
    filters.search_text ?? "",
    SEARCH_DEBOUNCE_MS,
  );

  const queryFilters = useMemo(() => {
    const searchText = searchImmediate
      ? (filters.search_text ?? "")
      : debouncedSearchText;

    return normalizeAttendanceFilters({
      ...filters,
      search_text: searchText,
    });
  }, [filters, debouncedSearchText, searchImmediate]);

  const queryFiltersKey = useMemo(
    () => attendanceFiltersQueryKey(queryFilters),
    [queryFilters],
  );

  const params = AttendanceTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "id",
    initialSortDirection: "asc",
  });

  useEffect(() => {
    syncTableFiltersToContext(queryFilters, attendanceContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync when query filters change
  }, [queryFilters]);

  useEffect(() => {
    if (
      searchImmediate &&
      debouncedSearchText === (filters.search_text ?? "")
    ) {
      setSearchImmediate(false);
    }
  }, [searchImmediate, debouncedSearchText, filters.search_text]);

  const { data: apiData, isLoading, refetch } = useQuery({
    queryKey: [
      "attendance",
      params.page,
      params.limit,
      params.sortBy,
      params.sortDirection,
      ...queryFiltersKey,
    ],
    queryFn: () =>
      fetchAttendanceData(
        params.page,
        params.limit,
        params.sortBy,
        params.sortDirection,
        queryFilters,
      ),
  });

  const data = apiData?.data || [];
  const totalPages = apiData?.totalPages || 1;
  const totalItems = apiData?.totalItems || 0;

  const canDelete = can(PERMISSIONS.attendance.attendance_departure.delete);

  const columns = useMemo<ColumnDef<AttendanceStatusRecord>[]>(() => {
    const baseColumns = getAttendanceColumns(t);

    if (canDelete) {
      return [
        ...baseColumns,
        {
          key: "actions",
          name: t("columns.actions") || "Actions",
          sortable: false,
          render: () => (
            <Button size="small" disabled>
              {t("action")}
            </Button>
          ),
        },
      ];
    }

    return baseColumns;
  }, [t, canDelete]);

  const state = AttendanceTable.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: getAttendanceRowId,
    loading: isLoading,
    filtered: queryFiltersKey.some((value) => value !== ""),
  });

  const handleFilterChange = useCallback(
    (next: AttendanceFilterParams) => {
      setFilters(next);
      params.setPage(1);
    },
    [params],
  );

  const handleSearchNow = useCallback(() => {
    setSearchImmediate(true);
    params.setPage(1);
    refetch();
  }, [params, refetch]);

  const handleResetFilters = useCallback(() => {
    const defaults = defaultAttendanceFilters();
    setSearchImmediate(false);
    setFilters(defaults);
    syncTableFiltersToContext(defaults, attendanceContext);
    params.reset();
  }, [attendanceContext, params]);

  return (
    <Box sx={{ p: 2 }}>
      <AttendanceTable
        filters={
          <Stack spacing={2}>
            <AttendanceFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearch={handleSearchNow}
              onReset={handleResetFilters}
            />
          </Stack>
        }
        table={
          <AttendanceTable.Table state={state} loadingOptions={{ rows: 5 }} />
        }
        pagination={<AttendanceTable.Pagination state={state} />}
      />
    </Box>
  );
};
