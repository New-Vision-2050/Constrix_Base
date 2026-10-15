"use client";

import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Collapse,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { ChevronDown, ChevronUp, RotateCcw, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { apiClient } from "@/config/axios-config";
import HeadlessTableLayout from "@/components/headless/table";
import TaskStatusBadge from "@/modules/hr-reports/employee-tasks/components/TaskStatusBadge";
import {
  AdvanceRequestsReportApi,
  LeaveRequestsReportApi,
  type AdvanceReportRow,
  type ApprovalReportParams,
  type LeaveReportRow,
  type RequestStatus,
  type RequestWorkflow,
} from "@/services/api/hr-reports/approval-requests";
import ApprovalReportDetailDialog, {
  type ApprovalReportKind,
} from "./components/ApprovalReportDetailDialog";

type Row = LeaveReportRow | AdvanceReportRow;
type EmployeeOption = { id: string; name: string };

const statuses: RequestStatus[] = [
  "pending",
  "approved",
  "rejected",
  "cancelled",
];

const LeaveTable = HeadlessTableLayout<Row>("hr-leave-requests-report");
const AdvanceTable = HeadlessTableLayout<Row>("hr-advance-requests-report");

export default function ApprovalReportPage({
  kind,
}: {
  kind: ApprovalReportKind;
}) {
  const t = useTranslations("HRReports.approvalReport");
  const isLeave = kind === "leave";
  const Table = isLeave ? LeaveTable : AdvanceTable;
  const api = isLeave ? LeaveRequestsReportApi : AdvanceRequestsReportApi;

  const [rows, setRows] = useState<Row[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [employee, setEmployee] = useState<EmployeeOption | null>(null);
  const [status, setStatus] = useState<RequestStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const tableParams = Table.useTableParams({
    initialPage: 1,
    initialLimit: 15,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    apiClient
      .get("/company-users/employees", { params: { page: 1, per_page: 100 } })
      .then(({ data }) => {
        const payload = Array.isArray(data?.payload)
          ? data.payload
          : Array.isArray(data?.data)
            ? data.data
            : [];
        setEmployees(
          payload
            .map((item: { id?: unknown; name?: unknown }) => ({
              id: String(item.id ?? ""),
              name: String(item.name ?? item.id ?? ""),
            }))
            .filter((item: EmployeeOption) => item.id),
        );
      })
      .catch(() => setEmployees([]));
  }, []);

  const requestParams = useMemo<ApprovalReportParams>(
    () => ({
      ...(employee?.id ? { user_id: employee.id } : {}),
      ...(status ? { status } : {}),
      ...(dateFrom ? { date_from: dateFrom } : {}),
      ...(dateTo ? { date_to: dateTo } : {}),
      ...(search ? { search } : {}),
      page: tableParams.page,
      per_page: tableParams.limit,
    }),
    [
      employee?.id,
      status,
      dateFrom,
      dateTo,
      search,
      tableParams.page,
      tableParams.limit,
    ],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    api
      .getList(requestParams)
      .then(({ data }) => {
        if (cancelled) return;
        const items = (Array.isArray(data?.payload) ? data.payload : []) as Row[];
        setRows(items);
        setTotal(data?.pagination?.result_count ?? items.length);
        setTotalPages(data?.pagination?.last_page ?? 1);
      })
      .catch(() => {
        if (cancelled) return;
        setRows([]);
        setTotal(0);
        setTotalPages(1);
        setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, requestParams]);

  const resetFilters = () => {
    setEmployee(null);
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setSearchInput("");
    setSearch("");
    tableParams.setPage(1);
  };

  const hasFilters = Boolean(
    employee || status || dateFrom || dateTo || searchInput,
  );

  const clickableCell = useCallback(
    (id: string, content: ReactNode) => (
      <Box
        onClick={() => setSelectedId(id)}
        sx={{
          cursor: "pointer",
          minHeight: 36,
          display: "flex",
          alignItems: "center",
        }}
      >
        {content}
      </Box>
    ),
    [],
  );

  const currentStepText = useCallback(
    (workflow?: RequestWorkflow) =>
      workflow?.auto_approved
        ? t("autoApproved")
        : workflow?.current_step?.name || "—",
    [t],
  );

  const columns = useMemo(() => {
    const text = (row: Row, value: ReactNode, minWidth?: number) =>
      clickableCell(
        row.id,
        <span className="p-2 text-sm" style={{ minWidth }}>
          {value}
        </span>,
      );

    const employeeCol = {
      key: "employee",
      name: t("employee"),
      sortable: false,
      minWidth: 180,
      render: (row: Row) =>
        clickableCell(
          row.id,
          <Box className="p-2">
            <Typography variant="body2" fontWeight={600}>
              {row.employee?.name || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.employee?.phone}
            </Typography>
          </Box>,
        ),
    };

    const typeCols = isLeave
      ? [
          {
            key: "leave_type",
            name: `${t("leaveType")} / ${t("policy")}`,
            sortable: false,
            minWidth: 200,
            render: (row: Row) => {
              const r = row as LeaveReportRow;
              return text(
                row,
                `${r.leave_type?.name ?? "—"} / ${r.leave_policy?.name ?? "—"}`,
              );
            },
          },
          {
            key: "dates",
            name: t("dates"),
            sortable: false,
            minWidth: 220,
            render: (row: Row) => {
              const r = row as LeaveReportRow;
              return text(row, `${r.start_date} → ${r.end_date}`);
            },
          },
          {
            key: "total_days",
            name: t("totalDays"),
            sortable: false,
            minWidth: 100,
            render: (row: Row) => text(row, (row as LeaveReportRow).total_days),
          },
          {
            key: "is_emergency",
            name: t("emergency"),
            sortable: false,
            minWidth: 110,
            render: (row: Row) =>
              clickableCell(
                row.id,
                (row as LeaveReportRow).is_emergency ? (
                  <TaskStatusBadge status="rejected" label={t("emergency")} />
                ) : (
                  <span className="p-2 text-sm">—</span>
                ),
              ),
          },
        ]
      : [
          {
            key: "advance_policy",
            name: t("policy"),
            sortable: false,
            minWidth: 160,
            render: (row: Row) =>
              text(row, (row as AdvanceReportRow).advance_policy?.name ?? "—"),
          },
          {
            key: "amount",
            name: t("amount"),
            sortable: false,
            minWidth: 120,
            render: (row: Row) => text(row, (row as AdvanceReportRow).amount),
          },
          {
            key: "installments",
            name: t("installments"),
            sortable: false,
            minWidth: 110,
            render: (row: Row) =>
              text(row, (row as AdvanceReportRow).installments),
          },
        ];

    return [
      employeeCol,
      ...typeCols,
      {
        key: "status",
        name: t("status"),
        sortable: false,
        minWidth: 130,
        render: (row: Row) =>
          clickableCell(
            row.id,
            <TaskStatusBadge status={row.status} label={row.status_label} />,
          ),
      },
      {
        key: "current_step",
        name: t("currentStep"),
        sortable: false,
        minWidth: 180,
        render: (row: Row) => text(row, currentStepText(row.workflow)),
      },
      {
        key: "created_at",
        name: t("createdAt"),
        sortable: false,
        minWidth: 170,
        render: (row: Row) => text(row, row.created_at),
      },
      {
        key: "actions",
        name: t("actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 100,
        render: (row: Row) => (
          <Tooltip title={t("viewDetails")}>
            <IconButton size="small" onClick={() => setSelectedId(row.id)}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ];
  }, [clickableCell, currentStepText, isLeave, t]);

  const tableState = Table.useTableState({
    data: rows,
    columns,
    totalPages,
    totalItems: total,
    params: tableParams,
    selectable: false,
    getRowId: (row) => row.id,
    loading,
    searchable: false,
    filtered: Boolean(employee || status || dateFrom || dateTo || search),
  });

  return (
    <Box className="container mx-auto p-6">
      <Box mb={3}>
        <Typography variant="h4" fontWeight={700}>
          {isLeave ? t("leaveTitle") : t("advanceTitle")}
        </Typography>
        <Typography color="text.secondary" mt={1}>
          {isLeave ? t("leaveDescription") : t("advanceDescription")}
        </Typography>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          mb: 2,
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() => setFiltersCollapsed((previous) => !previous)}
          >
            <IconButton size="small" sx={{ p: 0.5, mr: 0.5 }}>
              {filtersCollapsed ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronUp size={18} />
              )}
            </IconButton>
            <Typography variant="subtitle1" fontWeight="bold">
              {t("filtersTitle")}
            </Typography>
          </Box>
          <Button
            size="small"
            variant="outlined"
            startIcon={<RotateCcw size={14} />}
            onClick={resetFilters}
            disabled={!hasFilters}
          >
            {t("reset")}
          </Button>
        </Box>

        <Collapse in={!filtersCollapsed}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            sx={{ mt: 2 }}
          >
            <Autocomplete
              options={employees}
              value={employee}
              onChange={(_, value) => {
                setEmployee(value);
                tableParams.setPage(1);
              }}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              sx={{ minWidth: 220, flex: 1 }}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={`${option.id}-${String(key)}`} {...optionProps}>
                    {option.name}
                  </li>
                );
              }}
              renderInput={(inputParams) => (
                <TextField {...inputParams} size="small" label={t("employee")} />
              )}
            />
            <TextField
              select
              size="small"
              label={t("status")}
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as RequestStatus | "");
                tableParams.setPage(1);
              }}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {statuses.map((value) => (
                <MenuItem key={value} value={value}>
                  {t(`statuses.${value}`)}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size="small"
              type="date"
              label={t("dateFrom")}
              value={dateFrom}
              onChange={(event) => {
                setDateFrom(event.target.value);
                tableParams.setPage(1);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              type="date"
              label={t("dateTo")}
              value={dateTo}
              onChange={(event) => {
                setDateTo(event.target.value);
                tableParams.setPage(1);
              }}
              slotProps={{
                htmlInput: { min: dateFrom || undefined },
                inputLabel: { shrink: true },
              }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              size="small"
              label={t("search")}
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                tableParams.setPage(1);
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <Search className="me-2 size-4 text-muted-foreground" />
                  ),
                },
              }}
              sx={{ minWidth: 240, flex: 1 }}
            />
          </Stack>
        </Collapse>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {isLeave ? t("leaveListError") : t("advanceListError")}
        </Alert>
      )}

      <Box
        component={Paper}
        elevation={0}
        sx={{ p: 0, border: 1, borderColor: "divider", borderRadius: 2 }}
      >
        <Table
          table={<Table.Table state={tableState} loadingOptions={{ rows: 6 }} />}
          pagination={
            <Table.Pagination
              state={tableState}
              pageSizeOptions={[10, 15, 25, 50]}
            />
          }
        />
      </Box>

      <ApprovalReportDetailDialog
        kind={kind}
        requestId={selectedId}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </Box>
  );
}
