"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { InboxOutlined } from "@mui/icons-material";
import { Check, RotateCcw, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import HeadlessTableLayout, {
  type ColumnDef,
} from "@/components/headless/table";
import type {
  ApprovalInboxListResponse,
  ApprovalInboxParams,
  ApprovalInboxRow,
} from "@/services/api/approval-requests";
import { HR_APPROVAL_INBOX_COUNTS_QUERY_KEY } from "@/modules/hr-inbox/query-keys";
import ApprovalActionDialogs, {
  type ApprovalRequestAction,
} from "./ApprovalActionDialogs";

type InboxTableLayout<TRow> = ReturnType<typeof HeadlessTableLayout<TRow>>;

export interface SummaryColumnsContext {
  dash: string;
}

export interface ApprovalInboxTabProps<TSummary> {
  /** React Query key prefix for this tab's inbox list. */
  queryKey: string;
  /** A `HeadlessTableLayout` instance with a unique URL-params prefix. */
  table: InboxTableLayout<ApprovalInboxRow<TSummary>>;
  fetchInbox: (
    params: ApprovalInboxParams,
  ) => Promise<{ data: ApprovalInboxListResponse<TSummary> }>;
  approveRequest: (id: string) => Promise<unknown>;
  rejectRequest: (
    id: string,
    body: { rejection_reason: string },
  ) => Promise<unknown>;
  /** Request-type-specific columns rendered after the employee column. */
  summaryColumns: (
    ctx: SummaryColumnsContext,
  ) => ColumnDef<ApprovalInboxRow<TSummary>>[];
}

function normalizePayload<TSummary>(
  payload: ApprovalInboxListResponse<TSummary>["payload"],
): ApprovalInboxRow<TSummary>[] {
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

export default function ApprovalInboxTab<TSummary>({
  queryKey,
  table: TableLayout,
  fetchInbox,
  approveRequest,
  rejectRequest,
  summaryColumns,
}: ApprovalInboxTabProps<TSummary>) {
  const t = useTranslations("HrInbox.approvals");
  const tRoot = useTranslations("HrInbox");
  const tLabels = useTranslations("labels");
  const queryClient = useQueryClient();

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [action, setAction] =
    useState<ApprovalRequestAction<TSummary> | null>(null);

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 15,
  });

  const {
    data: queryData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [queryKey, params.page, params.limit, dateFrom, dateTo],
    queryFn: async () => {
      const response = await fetchInbox({
        page: params.page,
        per_page: params.limit,
        ...(dateFrom ? { date_from: dateFrom } : {}),
        ...(dateTo ? { date_to: dateTo } : {}),
      });
      const body = response.data;
      const rows = normalizePayload(body.payload);
      const pagination = body.pagination;
      return {
        data: rows,
        totalPages: Math.max(1, pagination?.last_page ?? 1),
        totalItems: pagination?.total ?? rows.length,
      };
    },
  });

  const data = queryData?.data ?? [];
  const totalPages = queryData?.totalPages ?? 1;
  const totalItems = queryData?.totalItems ?? 0;

  /** After any approve/reject: refetch this tab + both count badges. */
  const refreshInboxAndCounts = () => {
    void queryClient.invalidateQueries({ queryKey: [queryKey] });
    void queryClient.invalidateQueries({
      queryKey: [HR_APPROVAL_INBOX_COUNTS_QUERY_KEY],
    });
  };

  const columns: ColumnDef<ApprovalInboxRow<TSummary>>[] = useMemo(() => {
    const dash = tRoot("dash");

    return [
      {
        key: "employee",
        name: tRoot("colEmployee"),
        sortable: false,
        render: (row) => row.employee?.name ?? dash,
      },
      ...summaryColumns({ dash }),
      {
        key: "reason",
        name: t("colReason"),
        sortable: false,
        render: (row) => {
          const reason =
            (row.summary as { reason?: string | null } | null | undefined)
              ?.reason ?? "";
          if (!reason) return dash;
          return (
            <span className="max-w-xs truncate md:max-w-md" title={reason}>
              {reason}
            </span>
          );
        },
      },
      {
        key: "current_step",
        name: tRoot("colCurrentStep"),
        sortable: false,
        render: (row) => row.current_step?.name ?? dash,
      },
      {
        key: "created_at",
        name: tRoot("colCreated"),
        sortable: false,
        render: (row) => formatDateTime(row.created_at, dash),
      },
      {
        key: "actions",
        name: tLabels("actions"),
        sortable: false,
        align: "center" as const,
        render: (row) => (
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            flexWrap="nowrap"
          >
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<Check size={16} />}
              onClick={() => setAction({ type: "approve", row })}
            >
              {t("approve")}
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<X size={16} />}
              onClick={() => setAction({ type: "reject", row })}
            >
              {t("reject")}
            </Button>
          </Stack>
        ),
      },
    ];
  }, [summaryColumns, t, tRoot, tLabels]);

  const state = TableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: false,
    getRowId: (row) => String(row.id),
    loading: isLoading,
    searchable: false,
    filtered: dateFrom !== "" || dateTo !== "",
  });

  const hasDateFilter = dateFrom !== "" || dateTo !== "";
  const resetFilters = () => {
    setDateFrom("");
    setDateTo("");
    params.setPage(1);
  };

  // With an active date filter an empty result is a "no results" case —
  // let the table render its own filtered empty state for that one.
  const showEmptyState =
    !isLoading && !isError && data.length === 0 && !hasDateFilter;

  return (
    <Box>
      {/* Date filter */}
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 2, borderRadius: 2, border: 1, borderColor: "divider" }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <TextField
            size="small"
            type="date"
            label={t("dateFrom")}
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              params.setPage(1);
            }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { max: dateTo || undefined },
            }}
            sx={{ minWidth: 180 }}
          />
          <TextField
            size="small"
            type="date"
            label={t("dateTo")}
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              params.setPage(1);
            }}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: { min: dateFrom || undefined },
            }}
            sx={{ minWidth: 180 }}
          />
          <Button
            size="small"
            variant="outlined"
            startIcon={<RotateCcw size={14} />}
            onClick={resetFilters}
            disabled={!hasDateFilter}
          >
            {t("resetFilters")}
          </Button>
        </Stack>
      </Paper>

      {isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
          {error instanceof Error && process.env.NODE_ENV === "development" ? (
            <Typography
              variant="caption"
              component="div"
              className="mt-2 font-mono"
            >
              {error.message}
            </Typography>
          ) : null}
        </Alert>
      ) : null}

      {showEmptyState ? (
        <Paper
          elevation={0}
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 2,
            py: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <InboxOutlined sx={{ fontSize: 56, opacity: 0.4 }} />
          <Typography variant="h6" color="text.secondary">
            {t("emptyTitle")}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {t("emptyDescription")}
          </Typography>
        </Paper>
      ) : (
        <TableLayout
          table={
            <TableLayout.Table state={state} loadingOptions={{ rows: 6 }} />
          }
          pagination={<TableLayout.Pagination state={state} />}
        />
      )}

      <ApprovalActionDialogs
        action={action}
        onClose={() => setAction(null)}
        approveRequest={approveRequest}
        rejectRequest={rejectRequest}
        onRefresh={refreshInboxAndCounts}
      />
    </Box>
  );
}
