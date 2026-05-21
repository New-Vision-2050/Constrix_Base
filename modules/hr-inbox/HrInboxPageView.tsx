"use client";

import { useCallback, useMemo, useState } from "react";
import { Box, Typography, Alert, Button, MenuItem } from "@mui/material";
import { EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import HeadlessTableLayout from "@/components/headless/table";
import type { ColumnDef } from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import withPermissions from "@/lib/permissions/client/withPermissions";
import { PERMISSIONS } from "@/lib/permissions/permission-names";
import HrInboxDetailsDialog from "@/modules/hr-inbox/components/HrInboxDetailsDialog";
import { HR_EMPLOYEE_TASKS_INBOX_QUERY_KEY } from "@/modules/hr-inbox/query-keys";
import {
  EmployeeTasksApi,
  type EmployeeTaskInboxListResponse,
  type EmployeeTaskInboxRow,
} from "@/services/api/employee-tasks";

const HrInboxTableLayout = HeadlessTableLayout<EmployeeTaskInboxRow>(
  "hr-employee-tasks-inbox",
);

export { HR_EMPLOYEE_TASKS_INBOX_QUERY_KEY };

function normalizeInboxPayload(
  payload: EmployeeTaskInboxListResponse["payload"],
): EmployeeTaskInboxRow[] {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload;
  return Object.values(payload);
}

function formatDateTime(value: string | undefined, empty: string): string {
  if (value == null || value === "") return empty;
  const d = new Date(value.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function formatTaskDateOnly(value: string | undefined, empty: string): string {
  if (value == null || value === "") return empty;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

function approversLabel(row: EmployeeTaskInboxRow, empty: string): string {
  const takers = row.current_step?.action_takers;
  if (!takers?.length) return empty;
  return takers.map((a) => a.name).join(", ");
}

function HrInboxPageView() {
  const t = useTranslations("HrInbox");
  const tLabels = useTranslations("labels");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsRow, setDetailsRow] = useState<EmployeeTaskInboxRow | null>(
    null,
  );

  const openDetails = useCallback((row: EmployeeTaskInboxRow) => {
    setDetailsRow(row);
    setDetailsOpen(true);
  }, []);

  const closeDetails = useCallback(() => {
    setDetailsOpen(false);
    setDetailsRow(null);
  }, []);

  const params = HrInboxTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 15,
  });

  const { data: queryData, isLoading, isError, error } = useQuery({
    queryKey: [
      HR_EMPLOYEE_TASKS_INBOX_QUERY_KEY,
      params.page,
      params.limit,
      params.search,
    ],
    queryFn: async () => {
      const response = await EmployeeTasksApi.inbox({
        page: params.page,
        per_page: params.limit,
        ...(params.search ? { search: params.search } : {}),
      });
      const body = response.data;
      const payload = normalizeInboxPayload(body.payload);
      const pagination = body.pagination;
      const totalPages = pagination?.last_page ?? body.last_page ?? 1;
      const totalItems =
        pagination?.result_count ?? body.result_count ?? payload.length;

      return {
        data: payload,
        totalPages: totalPages >= 1 ? totalPages : 1,
        totalItems,
      };
    },
  });

  const data = queryData?.data ?? [];
  const totalPages = queryData?.totalPages ?? 1;
  const totalItems = queryData?.totalItems ?? 0;

  const columns: ColumnDef<EmployeeTaskInboxRow>[] = useMemo(() => {
    const dash = t("dash");

    return [
      {
        key: "serial_number",
        name: t("colSerial"),
        sortable: false,
        render: (row) => (
          <span className="font-mono text-sm tabular-nums">
            {row.task?.serial_number ?? row.serial_number ?? row.id}
          </span>
        ),
      },
      {
        key: "title",
        name: t("colTitle"),
        sortable: false,
        render: (row) => {
          const title = row.task?.title ?? row.title ?? dash;
          return (
            <span className="max-w-xs truncate md:max-w-md" title={title}>
              {title}
            </span>
          );
        },
      },
      {
        key: "user",
        name: t("colEmployee"),
        sortable: false,
        render: (row) => row.employee?.name ?? row.user?.name ?? dash,
      },
      {
        key: "status_label",
        name: t("colStatus"),
        sortable: false,
        render: (row) =>
          row.task?.status_label ||
          row.task?.status ||
          row.status_label ||
          row.status ||
          dash,
      },
      {
        key: "task_date",
        name: t("colTaskDate"),
        sortable: false,
        render: (row) =>
          formatTaskDateOnly(row.task?.task_date ?? row.task_date, dash),
      },
      {
        key: "duration_hours",
        name: t("colDuration"),
        sortable: false,
        render: (row) => {
          const hours =
            row.summary?.total_task_hours ?? row.duration_hours ?? null;
          return hours != null && hours !== "" ? String(hours) : dash;
        },
      },
      {
        key: "current_step",
        name: t("colCurrentStep"),
        sortable: false,
        render: (row) => row.current_step?.name ?? dash,
      },
      {
        key: "action_takers",
        name: t("colApprovers"),
        sortable: false,
        render: (row) => (
          <span
            className="max-w-[200px] truncate md:max-w-xs"
            title={approversLabel(row, dash)}
          >
            {approversLabel(row, dash)}
          </span>
        ),
      },
      {
        key: "created_at",
        name: t("colCreated"),
        sortable: false,
        render: (row) => formatDateTime(row.created_at, dash),
      },
      {
        key: "actions",
        name: tLabels("actions"),
        sortable: false,
        render: (row: EmployeeTaskInboxRow) => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button onClick={onClick}>{tLabels("actions")}</Button>
            )}
          >
            <MenuItem onClick={() => openDetails(row)}>
              <EyeIcon className="w-4 h-4 ml-2" />
              {t("viewDetails")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ];
  }, [openDetails, t, tLabels]);

  const state = HrInboxTableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: false,
    getRowId: (row) => String(row.id),
    loading: isLoading,
    searchable: true,
    filtered: params.search !== "",
  });

  return (
    <Box className="container mx-auto p-6">
      <Box className="mb-8">
        <Typography variant="h4" className="font-bold">
          {t("title")}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          className="mt-2 max-w-2xl leading-relaxed"
        >
          {t("description")}
        </Typography>
      </Box>

      {isError ? (
        <Alert severity="error" className="mb-4">
          {t("loadError")}
          {error instanceof Error && process.env.NODE_ENV === "development" ? (
            <Typography variant="caption" component="div" className="mt-2 font-mono">
              {error.message}
            </Typography>
          ) : null}
        </Alert>
      ) : null}

      <Box sx={{ p: 0 }}>
        <HrInboxTableLayout
          filters={
            <HrInboxTableLayout.TopActions state={state} customActions={null} />
          }
          table={
            <HrInboxTableLayout.Table
              state={state}
              loadingOptions={{ rows: 6 }}
            />
          }
          pagination={<HrInboxTableLayout.Pagination state={state} />}
        />
      </Box>

      <HrInboxDetailsDialog
        open={detailsOpen}
        onClose={closeDetails}
        row={detailsRow}
      />
    </Box>
  );
}

export default withPermissions(HrInboxPageView, [
  [
    PERMISSIONS.humanResources.charts.view,
    PERMISSIONS.humanResources.procedures.view,
    PERMISSIONS.humanResources.services.view,
  ],
]);
