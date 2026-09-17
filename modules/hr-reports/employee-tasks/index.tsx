"use client";

import { type ReactNode, useCallback, useEffect, useMemo, useState } from "react";
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
import {
  EmployeeTasksReportApi,
  type EmployeeTaskReportParams,
  type EmployeeTaskReportRow,
  type TaskStatus,
} from "@/services/api/hr-reports/employee-tasks";
import TaskDetailDialog from "./components/TaskDetailDialog";
import TaskStatusBadge from "./components/TaskStatusBadge";
import HeadlessTableLayout from "@/components/headless/table";

type EmployeeOption = { id: string; name: string };
type Pagination = {
  current_page?: number;
  last_page?: number;
  per_page?: number;
  total?: number;
};

const statuses: TaskStatus[] = [
  "pending",
  "approved",
  "rejected",
  "in_progress",
  "paused",
  "completed",
  "cancelled",
];

const HeadlessTaskReportsTable = HeadlessTableLayout<EmployeeTaskReportRow>(
  "hr-employee-task-reports",
);

function parseList(raw: unknown): {
  items: EmployeeTaskReportRow[];
  pagination: Pagination;
} {
  const root = (raw ?? {}) as Record<string, unknown>;
  const data = root.data ?? root.payload;
  if (Array.isArray(data)) {
    return {
      items: data as EmployeeTaskReportRow[],
      pagination: (root.pagination ?? {}) as Pagination,
    };
  }
  const nested = (data ?? {}) as Record<string, unknown>;
  return {
    items: (Array.isArray(nested.items)
      ? nested.items
      : Array.isArray(nested.data)
        ? nested.data
        : []) as EmployeeTaskReportRow[],
    pagination: {
      ...((root.pagination ?? {}) as Pagination),
      current_page: Number(nested.current_page ?? (root.pagination as Pagination)?.current_page ?? 1),
      last_page: Number(nested.last_page ?? (root.pagination as Pagination)?.last_page ?? 1),
      per_page: Number(nested.per_page ?? (root.pagination as Pagination)?.per_page ?? 15),
      total: Number(nested.total ?? (root.pagination as Pagination)?.total ?? 0),
    },
  };
}

export default function EmployeeTaskReportPage() {
  const t = useTranslations("HRReports.taskReport");
  const [rows, setRows] = useState<EmployeeTaskReportRow[]>([]);
  const [employees, setEmployees] = useState<EmployeeOption[]>([]);
  const [employee, setEmployee] = useState<EmployeeOption | null>(null);
  const [status, setStatus] = useState<TaskStatus | "">("");
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
  const tableParams = HeadlessTaskReportsTable.useTableParams({
    initialPage: 1,
    initialLimit: 15,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);
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

  const requestParams = useMemo<EmployeeTaskReportParams>(
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
    EmployeeTasksReportApi.getList(requestParams)
      .then(({ data }) => {
        if (cancelled) return;
        const parsed = parseList(data);
        setRows(parsed.items);
        setTotal(parsed.pagination.total ?? parsed.items.length);
        setTotalPages(parsed.pagination.last_page ?? 1);
      })
      .catch(() => {
        if (!cancelled) {
          setRows([]);
          setTotal(0);
          setTotalPages(1);
          setError(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [requestParams]);

  const resetFilters = () => {
    setEmployee(null);
    setStatus("");
    setDateFrom("");
    setDateTo("");
    setSearchInput("");
    setSearch("");
    tableParams.setPage(1);
  };

  const hasFilters = Boolean(employee || status || dateFrom || dateTo || searchInput);

  const clickableCell = useCallback(
    (taskId: string, content: ReactNode) => (
      <Box
        onClick={() => setSelectedId(taskId)}
        sx={{ cursor: "pointer", minHeight: 36, display: "flex", alignItems: "center" }}
      >
        {content}
      </Box>
    ),
    [],
  );

  const columns = useMemo(
    () => [
      {
        key: "serial_number",
        name: t("serial"),
        sortable: false,
        minWidth: 140,
        render: (row: EmployeeTaskReportRow) => clickableCell(row.id, (
          <span className="p-2 text-sm">{row.serial_number}</span>
        )),
      },
      {
        key: "employee",
        name: t("employee"),
        sortable: false,
        minWidth: 180,
        render: (row: EmployeeTaskReportRow) => clickableCell(row.id, (
          <Box className="p-2">
            <Typography variant="body2" fontWeight={600}>
              {row.employee?.name || "—"}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.employee?.phone}
            </Typography>
          </Box>
        )),
      },
      {
        key: "title",
        name: t("task"),
        sortable: false,
        minWidth: 190,
        render: (row: EmployeeTaskReportRow) => clickableCell(row.id, (
          <span className="p-2 text-sm">{row.title}</span>
        )),
      },
      {
        key: "task_type",
        name: t("taskType"),
        sortable: false,
        minWidth: 140,
        render: (row: EmployeeTaskReportRow) => clickableCell(row.id, (
          <span className="p-2 text-sm">{row.task_type?.name || "—"}</span>
        )),
      },
      {
        key: "task_date",
        name: t("taskDate"),
        sortable: false,
        minWidth: 130,
        render: (row: EmployeeTaskReportRow) => clickableCell(row.id, (
          <span className="p-2 text-sm">{row.task_date}</span>
        )),
      },
      {
        key: "time",
        name: t("time"),
        sortable: false,
        minWidth: 280,
        render: (row: EmployeeTaskReportRow) => clickableCell(row.id, (
          <span className="whitespace-nowrap p-2 text-sm">
            {row.time_from} → {row.time_to}
          </span>
        )),
      },
      {
        key: "duration_hours",
        name: t("duration"),
        sortable: false,
        minWidth: 120,
        render: (row: EmployeeTaskReportRow) => clickableCell(row.id, (
          <span className="p-2 text-sm">{row.duration_hours}</span>
        )),
      },
      {
        key: "status",
        name: t("status"),
        sortable: false,
        minWidth: 130,
        render: (row: EmployeeTaskReportRow) => clickableCell(row.id, (
          <TaskStatusBadge status={row.status} label={row.status_label} />
        )),
      },
      {
        key: "actions",
        name: t("actions"),
        sortable: false,
        align: "center" as const,
        minWidth: 100,
        render: (row: EmployeeTaskReportRow) => (
          <Tooltip title={t("viewDetails")}>
            <IconButton size="small" onClick={() => setSelectedId(row.id)}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ),
      },
    ],
    [clickableCell, t],
  );

  const tableState = HeadlessTaskReportsTable.useTableState({
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
        <Typography variant="h4" fontWeight={700}>{t("title")}</Typography>
        <Typography color="text.secondary" mt={1}>{t("description")}</Typography>
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
                setStatus(event.target.value as TaskStatus | "");
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
          {t("listError")}
        </Alert>
      )}

      <Box
        component={Paper}
        elevation={0}
        sx={{ p: 0, border: 1, borderColor: "divider", borderRadius: 2 }}
      >
        <HeadlessTaskReportsTable
          table={
            <HeadlessTaskReportsTable.Table
              state={tableState}
              loadingOptions={{ rows: 6 }}
            />
          }
          pagination={
            <HeadlessTaskReportsTable.Pagination
              state={tableState}
              pageSizeOptions={[10, 15, 25, 50]}
            />
          }
        />
      </Box>

      <TaskDetailDialog
        taskId={selectedId}
        open={Boolean(selectedId)}
        onClose={() => setSelectedId(null)}
      />
    </Box>
  );
}
