"use client";

import { useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import { cn } from "@/lib/utils";
import { useEmployeeAttendanceReports } from "../../hooks/useEmployeeAttendanceReports";
import { AttendanceMonthlyReportRow } from "../../types/reports";
import { formatMonthYearFromParts } from "../../utils/calendar";
import { useAttendanceDirection } from "../../utils/direction";
import { formatLocalizedValue } from "../../utils/i18n";
import { mapMonthlyReports } from "../../utils/reports-mapper";
import { ReportActionButton, ReportStatusBadge } from "./ReportTableCells";

const TableLayout = HeadlessTableLayout<AttendanceMonthlyReportRow>(
  "attendance-reports-table",
);

function CellValue({
  children,
  locale,
  tone = "default",
}: {
  children: React.ReactNode;
  locale: string;
  tone?: "default" | "success" | "info" | "accent";
}) {
  const toneClass =
    tone === "success"
      ? "text-[#00C853]"
      : tone === "info"
        ? "text-[#8B9CFF]"
        : tone === "accent"
          ? "text-[#E91E63]"
          : "text-foreground";

  const content =
    typeof children === "number"
      ? formatLocalizedValue(children, locale)
      : typeof children === "string"
        ? formatLocalizedValue(children, locale)
        : children;

  return (
    <span className={cn("text-xs font-medium", toneClass)} dir="ltr">
      {content}
    </span>
  );
}

interface AttendanceReportsTableProps {
  employeeId: string;
}

export default function AttendanceReportsTable({
  employeeId,
}: AttendanceReportsTableProps) {
  const t = useTranslations("AttendancePresence.reports");
  const tRoot = useTranslations("AttendancePresence");
  const locale = useLocale();
  const { dir } = useAttendanceDirection();

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 12,
  });

  const { data, isLoading, isError } = useEmployeeAttendanceReports(employeeId, {
    page: params.page,
    per_page: params.limit,
  });

  const records = useMemo(
    () => (data ? mapMonthlyReports(data) : []),
    [data],
  );

  const pagination = data?.monthly_reports.pagination;
  const totalItems = pagination?.total ?? records.length;
  const totalPages = pagination?.last_page ?? 1;

  useEffect(() => {
    params.setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when employee changes
  }, [employeeId]);

  const columns = useMemo(
    () => [
      {
        key: "month",
        name: t("month"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <span>{formatMonthYearFromParts(row.month, row.year, locale)}</span>
        ),
      },
      {
        key: "monthDays",
        name: t("monthDays"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue locale={locale}>{row.monthDays}</CellValue>
        ),
      },
      {
        key: "requiredAttendance",
        name: t("requiredAttendance"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue locale={locale}>{row.requiredAttendance}</CellValue>
        ),
      },
      {
        key: "accruedLeaves",
        name: t("accruedLeaves"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue locale={locale}>{row.accruedLeaves}</CellValue>
        ),
      },
      {
        key: "monthHolidays",
        name: t("monthHolidays"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue locale={locale}>{row.monthHolidays}</CellValue>
        ),
      },
      {
        key: "requiredHours",
        name: t("requiredHours"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue locale={locale}>{row.requiredHours}</CellValue>
        ),
      },
      {
        key: "achievedAttendance",
        name: t("achievedAttendance"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue tone="success" locale={locale}>
            {row.achievedAttendance}
          </CellValue>
        ),
      },
      {
        key: "usedLeaves",
        name: t("usedLeavesColumn"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue tone="info" locale={locale}>
            {row.usedLeaves}
          </CellValue>
        ),
      },
      {
        key: "leaveBalance",
        name: t("leaveBalance"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue locale={locale}>{row.leaveBalance}</CellValue>
        ),
      },
      {
        key: "achievedHours",
        name: t("achievedHoursColumn"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue tone="success" locale={locale}>
            {row.achievedHours}
          </CellValue>
        ),
      },
      {
        key: "delays",
        name: t("delays"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue tone="accent" locale={locale}>
            {row.delays}
          </CellValue>
        ),
      },
      {
        key: "overtime",
        name: t("overtime"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue locale={locale}>{row.overtime}</CellValue>
        ),
      },
      {
        key: "deductions",
        name: t("deductions"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <CellValue tone="accent" locale={locale}>
            {row.deductions}
          </CellValue>
        ),
      },
      {
        key: "status",
        name: t("statusColumn"),
        sortable: false,
        render: (row: AttendanceMonthlyReportRow) => (
          <ReportStatusBadge status={row.status} />
        ),
      },
      {
        key: "actions",
        name: t("actions"),
        sortable: false,
        render: () => <ReportActionButton />,
      },
    ],
    [locale, t],
  );

  const state = TableLayout.useTableState({
    data: records,
    columns,
    totalPages,
    totalItems,
    params,
    loading: isLoading,
    selectable: false,
    getRowId: (row) => row.id,
  });

  if (isError) {
    return (
      <Box dir={dir} sx={{ py: 2 }}>
        <span className="text-sm text-destructive">{tRoot("loadError")}</span>
      </Box>
    );
  }

  return (
    <Box dir={dir} sx={{ overflowX: "auto" }}>
      <TableLayout
        table={
          <TableLayout.Table state={state} loadingOptions={{ rows: 5 }} />
        }
        pagination={
          <TableLayout.Pagination
            state={state}
            pageSizeOptions={[12, 24, 48]}
          />
        }
      />
    </Box>
  );
}
