"use client";

import { useEffect, useMemo } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { UserAttendanceCalendarDay } from "@/services/api/user-attendance";
import { useAttendancePresence } from "../../context/AttendancePresenceContext";
import { useUserAttendanceCalendar } from "../../hooks/useUserAttendanceCalendar";
import { StatusBadge } from "../shared/StatusDot";
import { useAttendanceDirection } from "../../utils/direction";
import { getLocalizedStatusLabel } from "../../utils/i18n";

const TableLayout = HeadlessTableLayout<UserAttendanceCalendarDay>(
  "attendance-work-log-table",
);

function formatDateLabel(date: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
  }).format(new Date(date));
}

export default function WorkLogTable() {
  const t = useTranslations("AttendancePresence");
  const statusT = useTranslations("AttendancePresence.status");
  const locale = useLocale();
  const { dir } = useAttendanceDirection();
  const { selectedMonth } = useAttendancePresence();

  const month = selectedMonth.getMonth() + 1;
  const year = selectedMonth.getFullYear();
  const { data, isLoading, isError } = useUserAttendanceCalendar(month, year);

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 5,
  });

  const allRecords = useMemo(
    () => [...(data?.days ?? [])].reverse(),
    [data?.days],
  );

  const paginatedData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return allRecords.slice(start, start + params.limit);
  }, [allRecords, params.page, params.limit]);

  const totalItems = allRecords.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  useEffect(() => {
    params.setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when month changes
  }, [month, year]);

  const columns = useMemo(
    () => [
      {
        key: "date",
        name: t("date"),
        sortable: false,
        render: (row: UserAttendanceCalendarDay) => (
          <span>{formatDateLabel(row.date, locale)}</span>
        ),
      },
      {
        key: "status",
        name: t("statusColumn"),
        sortable: false,
        render: (row: UserAttendanceCalendarDay) => (
          <StatusBadge
            label={getLocalizedStatusLabel(
              row.status_key,
              row.status,
              locale,
              statusT,
            )}
            dotColor={row.dot_color}
          />
        ),
      },
      {
        key: "checkIn",
        name: t("checkIn"),
        sortable: false,
        render: () => (
          <span dir="ltr">--</span>
        ),
      },
      {
        key: "checkOut",
        name: t("checkOut"),
        sortable: false,
        render: () => (
          <span dir="ltr">--</span>
        ),
      },
      {
        key: "workHours",
        name: t("workHours"),
        sortable: false,
        render: (row: UserAttendanceCalendarDay) => (
          <span dir="ltr">{row.duration_formatted ?? "--:--"}</span>
        ),
      },
      {
        key: "delay",
        name: t("delay"),
        sortable: false,
        render: () => (
          <span dir="ltr">--</span>
        ),
      },
      {
        key: "notes",
        name: t("notes"),
        sortable: false,
        render: () => <span>-</span>,
      },
    ],
    [t, statusT, locale],
  );

  const state = TableLayout.useTableState({
    data: paginatedData,
    columns,
    totalPages,
    totalItems,
    params,
    loading: isLoading,
    selectable: false,
    getRowId: (row) => row.date,
  });

  if (isLoading && !data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ py: 2 }}>
        <Alert severity="error">{t("loadError")}</Alert>
      </Box>
    );
  }

  return (
    <Box dir={dir}>
      <TableLayout
        table={
          <TableLayout.Table state={state} loadingOptions={{ rows: 5 }} />
        }
        pagination={<TableLayout.Pagination state={state} />}
      />
    </Box>
  );
}
