"use client";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { AttendanceStatusRecord } from "@/modules/attendance-departure/types/attendance";
import { AttendanceFilters } from "./AttendanceFilters";
import { getAttendanceColumns } from "./columns";
import { fetchAttendanceData } from "./api";
import { useAttendance } from "../../../context/AttendanceContext";
import { AttendanceFilterParams } from "./types";
import { ActionsColumn } from "./ActionsColumn";
import { usePermissions } from "@/lib/permissions/client/permissions-provider";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import { ColumnDef } from "@/components/headless/table";

// Create typed table instance
const AttendanceTable = HeadlessTableLayout<AttendanceStatusRecord>();

/**
 * Main attendance table component using headless table pattern
 */
export const AttendanceTableV2: React.FC = () => {
  const t = useTranslations("AttendanceDepartureModule.Table");
  const { setStartDate, setEndDate } = useAttendance();
  const { can } = usePermissions();

  // Filter state
  const [filters, setFilters] = useState<AttendanceFilterParams>({
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  // STEP 1: useTableParams hook
  const params = AttendanceTable.useTableParams({
    initialPage: 1,
    initialLimit: 10,
    initialSortBy: "id",
    initialSortDirection: "asc",
  });

  // STEP 2: Fetch data with React Query
  const { data: apiData, isLoading, refetch } = useQuery({
    queryKey: ["attendance", params.page, params.limit, params.sortBy, params.sortDirection, filters],
    queryFn: () =>
      fetchAttendanceData(
        params.page,
        params.limit,
        params.sortBy,
        params.sortDirection,
        filters
      ),
  });

  const data = apiData?.data || [];
  const totalPages = apiData?.totalPages || 1;
  const totalItems = apiData?.totalItems || 0;

  // Check delete permission
  const canDelete = can(PERMISSIONS.attendance.attendance_departure.delete);

  // Define columns with actions column
  const columns = useMemo<ColumnDef<AttendanceStatusRecord>[]>(() => {
    const baseColumns = getAttendanceColumns(t);
    
    if (canDelete) {
      return [
        ...baseColumns,
        {
          key: "actions",
          name: t("columns.actions") || "Actions",
          sortable: false,
          render: (row) => (
            <ActionsColumn
              row={row}
              onRefetch={refetch}
              canDelete={canDelete}
            />
          ),
        },
      ];
    }
    
    return baseColumns;
  }, [t, canDelete, refetch]);

  // STEP 3: useTableState hook
  const state = AttendanceTable.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    getRowId: (row: AttendanceStatusRecord) => row.id,
    loading: isLoading,
    filtered: Object.values(filters).some((v) => v !== undefined && v !== ""),
  });

  // Handle filter changes
  const handleFilterChange = (newFilters: AttendanceFilterParams) => {
    setFilters(newFilters);
    params.setPage(1);

    // Update context dates
    if (newFilters.start_date) setStartDate(new Date(newFilters.start_date));
    if (newFilters.end_date) setEndDate(new Date(newFilters.end_date));
  };

  // Reset filters
  const handleResetFilters = () => {
    const today = new Date().toISOString().split("T")[0];
    setFilters({ start_date: today, end_date: today });
    params.reset();
  };

  return (
    <Box sx={{ p: 2 }}>
      <AttendanceTable
        filters={
          <Stack spacing={2}>
            <AttendanceFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </Stack>
        }
        table={<AttendanceTable.Table state={state} loadingOptions={{ rows: 5 }} />}
        pagination={<AttendanceTable.Pagination state={state} />}
      />
    </Box>
  );
};
