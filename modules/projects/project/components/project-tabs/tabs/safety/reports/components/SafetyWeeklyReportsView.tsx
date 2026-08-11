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
import { VisibilityOutlined } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { ProjectSafetyApi } from "@/services/api/projects/project-safety";
import { getErrorMessage } from "@/utils/errorHandler";
import { useSafetyWeeklyReports } from "../query/useSafetyWeeklyReports";
import {
  EMPTY_SAFETY_WEEKLY_REPORT_FILTERS,
  type SafetyWeeklyReportFilters,
  type SafetyWeeklyReportRow,
} from "../types";
import CreateSafetyWeeklyReportDialog from "./CreateSafetyWeeklyReportDialog";
import SafetyWeeklyReportFileDialog from "./SafetyWeeklyReportFileDialog";
import SafetyWeeklyReportStatusBadge from "./SafetyWeeklyReportStatusBadge";

const SafetyWeeklyReportsTableLayout = HeadlessTableLayout<SafetyWeeklyReportRow>(
  "safety-weekly-reports",
);

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "—";
  const dateOnly = isoDate.slice(0, 10);
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export default function SafetyWeeklyReportsView() {
  const { projectId } = useProject();
  const t = useTranslations("project.safetyTab.weeklyReports");
  const tTable = useTranslations("project.safetyTab.weeklyReports.table");
  const tFilters = useTranslations("project.safetyTab.weeklyReports.filters");
  const format = useFormatter();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<SafetyWeeklyReportFilters>(
    EMPTY_SAFETY_WEEKLY_REPORT_FILTERS,
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [previewReport, setPreviewReport] =
    useState<SafetyWeeklyReportRow | null>(null);

  const params = SafetyWeeklyReportsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const reportsQuery = useSafetyWeeklyReports(projectId, filters);
  const allRows = useMemo(
    () => reportsQuery.data ?? [],
    [reportsQuery.data],
  );

  const totalItems = allRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));
  const hasDateFilter = Boolean(filters.fromDate || filters.toDate);

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return allRows.slice(start, start + params.limit);
  }, [allRows, params.page, params.limit]);

  const updateFilter = <K extends keyof SafetyWeeklyReportFilters>(
    key: K,
    value: SafetyWeeklyReportFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    params.setPage(1);
  };

  const handleClearDateFilter = () => {
    setFilters(EMPTY_SAFETY_WEEKLY_REPORT_FILTERS);
    params.setPage(1);
  };

  const formatCreatedAt = (value: string) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return formatDisplayDate(value);
    return format.dateTime(date, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const handleCreateReport = async (range: {
    fromDate: string;
    toDate: string;
  }) => {
    if (!projectId) return;
    setCreating(true);
    try {
      await ProjectSafetyApi.createWeeklyReportForProject(projectId, {
        from_date: range.fromDate,
        to_date: range.toDate,
      });
      toast.success(t("createSuccess"));
      setCreateOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["project-safety-weekly-reports", projectId],
      });
      params.setPage(1);
    } catch (error) {
      toast.error(getErrorMessage(error) ?? t("createError"));
    } finally {
      setCreating(false);
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "serialNumber",
        name: tTable("serialNumber"),
        sortable: false,
        minWidth: 130,
        render: (row: SafetyWeeklyReportRow) => (
          <span className="font-medium">{row.serialNumber || "—"}</span>
        ),
      },
      {
        key: "name",
        name: tTable("name"),
        sortable: false,
        minWidth: 240,
        render: (row: SafetyWeeklyReportRow) => (
          <span>{row.name || "—"}</span>
        ),
      },
      {
        key: "fromDate",
        name: tTable("fromDate"),
        sortable: false,
        minWidth: 110,
        render: (row: SafetyWeeklyReportRow) => (
          <span>{formatDisplayDate(row.fromDate)}</span>
        ),
      },
      {
        key: "toDate",
        name: tTable("toDate"),
        sortable: false,
        minWidth: 110,
        render: (row: SafetyWeeklyReportRow) => (
          <span>{formatDisplayDate(row.toDate)}</span>
        ),
      },
      {
        key: "status",
        name: tTable("status"),
        sortable: false,
        minWidth: 120,
        render: (row: SafetyWeeklyReportRow) => (
          <SafetyWeeklyReportStatusBadge
            status={row.status}
            statusLabel={row.statusLabel}
          />
        ),
      },
      {
        key: "createdAt",
        name: tTable("createdAt"),
        sortable: false,
        minWidth: 160,
        render: (row: SafetyWeeklyReportRow) => (
          <span>{formatCreatedAt(row.createdAt || row.generatedAt)}</span>
        ),
      },
      {
        key: "actions",
        name: tTable("actions"),
        sortable: false,
        minWidth: 120,
        render: (row: SafetyWeeklyReportRow) =>
          row.hasFile && row.downloadUrl ? (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<VisibilityOutlined />}
              onClick={() => setPreviewReport(row)}
            >
              {tTable("show")}
            </Button>
          ) : (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          ),
      },
    ],
    [format, tTable],
  );

  const state = SafetyWeeklyReportsTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: false,
    getRowId: (row: SafetyWeeklyReportRow) => row.id,
    loading: reportsQuery.isLoading || reportsQuery.isFetching,
    searchable: false,
    filtered: hasDateFilter,
  });

  if (!projectId) {
    return null;
  }

  return (
    <Box
      component={Paper}
      elevation={0}
      sx={{ p: 0, border: 1, borderColor: "divider", borderRadius: 2 }}
    >
      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="subtitle1" fontWeight={700}>
          {t("createdReportsTitle")}
        </Typography>
        {totalItems === 0 && !reportsQuery.isLoading ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {t("emptyReports")}
          </Typography>
        ) : null}
      </Box>

      {reportsQuery.isError ? (
        <Alert severity="error" sx={{ mx: 2, mt: 2 }}>
          {t("loadError")}
        </Alert>
      ) : null}

      <SafetyWeeklyReportsTableLayout
        filters={
          <SafetyWeeklyReportsTableLayout.TopActions
            state={state}
            customActions={
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setCreateOpen(true)}
              >
                {t("createReport")}
              </Button>
            }
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              alignItems={{ xs: "stretch", sm: "center" }}
              sx={{ mb: 1 }}
            >
              <TextField
                type="date"
                size="small"
                label={tFilters("fromDate")}
                value={filters.fromDate}
                onChange={(e) => updateFilter("fromDate", e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    max: filters.toDate || undefined,
                  },
                }}
                sx={{ minWidth: 160 }}
              />
              <TextField
                type="date"
                size="small"
                label={tFilters("toDate")}
                value={filters.toDate}
                onChange={(e) => updateFilter("toDate", e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  htmlInput: {
                    min: filters.fromDate || undefined,
                  },
                }}
                sx={{ minWidth: 160 }}
              />
              {hasDateFilter ? (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearDateFilter}
                >
                  {t("resetFilters")}
                </Button>
              ) : null}
            </Stack>
          </SafetyWeeklyReportsTableLayout.TopActions>
        }
        table={
          <Box sx={{ overflowX: "auto" }}>
            <SafetyWeeklyReportsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 6 }}
            />
          </Box>
        }
        pagination={<SafetyWeeklyReportsTableLayout.Pagination state={state} />}
      />

      <CreateSafetyWeeklyReportDialog
        open={createOpen}
        loading={creating}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreateReport}
      />

      <SafetyWeeklyReportFileDialog
        open={Boolean(previewReport)}
        report={previewReport}
        onClose={() => setPreviewReport(null)}
      />
    </Box>
  );
}
