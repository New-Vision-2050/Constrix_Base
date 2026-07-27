"use client";

import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FileDownloadOutlined } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useSafetyReports } from "../query/useSafetyReports";
import {
  EMPTY_SAFETY_REPORT_FILTERS,
  type SafetyReportFilters,
  type SafetyReportRow,
} from "../types";
import SafetyReportStatusBadge from "./SafetyReportStatusBadge";

const SafetyReportsTableLayout = HeadlessTableLayout<SafetyReportRow>(
  "safety-reports",
);

function filterSafetyReports(
  rows: SafetyReportRow[],
  filters: SafetyReportFilters,
  search: string,
): SafetyReportRow[] {
  const normalizedSearch = search.trim().toLowerCase();

  return rows.filter((row) => {
    if (
      filters.reference &&
      !row.morphableDisplay
        .toLowerCase()
        .includes(filters.reference.trim().toLowerCase())
    ) {
      return false;
    }

    if (filters.contractor && row.contractorName !== filters.contractor) {
      return false;
    }

    if (filters.consultant && row.consultant !== filters.consultant) {
      return false;
    }

    if (
      filters.engineer &&
      !row.consultantEngineer
        .toLowerCase()
        .includes(filters.engineer.trim().toLowerCase())
    ) {
      return false;
    }

    if (normalizedSearch) {
      const haystack = [
        row.morphableDisplay,
        row.contractorName,
        row.consultant,
        row.consultantEngineer,
      ]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(normalizedSearch)) {
        return false;
      }
    }

    return true;
  });
}

export default function SafetyReportsView() {
  const { projectId } = useProject();
  const t = useTranslations("project.safetyTab.reports");
  const tTable = useTranslations("project.safetyTab.reports.table");
  const tFilters = useTranslations("project.safetyTab.reports.filters");

  const [filters, setFilters] = useState<SafetyReportFilters>(
    EMPTY_SAFETY_REPORT_FILTERS,
  );

  const params = SafetyReportsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const reportsQuery = useSafetyReports(projectId);
  const allRows = useMemo(
    () => reportsQuery.data ?? [],
    [reportsQuery.data],
  );

  const contractorOptions = useMemo(
    () =>
      [...new Set(allRows.map((row) => row.contractorName).filter(Boolean))].sort(),
    [allRows],
  );

  const consultantOptions = useMemo(
    () =>
      [...new Set(allRows.map((row) => row.consultant).filter(Boolean))].sort(),
    [allRows],
  );

  const engineerOptions = useMemo(
    () =>
      [...new Set(allRows.map((row) => row.consultantEngineer).filter(Boolean))].sort(),
    [allRows],
  );

  const filteredRows = useMemo(
    () => filterSafetyReports(allRows, filters, params.search),
    [allRows, filters, params.search],
  );

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const updateFilter = <K extends keyof SafetyReportFilters>(
    key: K,
    value: SafetyReportFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    params.setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_SAFETY_REPORT_FILTERS);
    params.setSearch("");
    params.setPage(1);
  };

  const handleExport = () => {
    toast.info(t("exportComingSoon"));
  };

  const columns = useMemo(
    () => [
      {
        key: "morphableDisplay",
        name: tTable("reference"),
        sortable: false,
        minWidth: 160,
        render: (row: SafetyReportRow) => (
          <span className="font-medium">{row.morphableDisplay || "—"}</span>
        ),
      },
      {
        key: "status",
        name: tTable("status"),
        sortable: false,
        minWidth: 140,
        render: (row: SafetyReportRow) => (
          <SafetyReportStatusBadge
            status={row.status}
            statusLabel={row.statusLabel}
          />
        ),
      },
      {
        key: "totalAssignments",
        name: tTable("totalAssignments"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (row: SafetyReportRow) => <span>{row.totalAssignments}</span>,
      },
      {
        key: "completedCount",
        name: tTable("completedCount"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (row: SafetyReportRow) => <span>{row.completedCount}</span>,
      },
      {
        key: "pendingCount",
        name: tTable("pendingCount"),
        sortable: false,
        align: "center" as const,
        minWidth: 120,
        render: (row: SafetyReportRow) => <span>{row.pendingCount}</span>,
      },
      {
        key: "contractorName",
        name: tTable("contractorName"),
        sortable: false,
        minWidth: 160,
        render: (row: SafetyReportRow) => <span>{row.contractorName}</span>,
      },
      {
        key: "consultant",
        name: tTable("consultant"),
        sortable: false,
        minWidth: 160,
        render: (row: SafetyReportRow) => <span>{row.consultant}</span>,
      },
      {
        key: "consultantEngineer",
        name: tTable("consultantEngineer"),
        sortable: false,
        minWidth: 160,
        render: (row: SafetyReportRow) => <span>{row.consultantEngineer}</span>,
      },
      {
        key: "actions",
        name: tTable("actions"),
        sortable: false,
        minWidth: 120,
        render: () => (
          <CustomMenu
            renderAnchor={({ onClick }) => (
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={onClick}
              >
                {tTable("action")}
              </Button>
            )}
          >
            <MenuItem onClick={() => toast.info(t("viewComingSoon"))}>
              {tTable("view")}
            </MenuItem>
          </CustomMenu>
        ),
      },
    ],
    [t, tTable],
  );

  const state = SafetyReportsTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: SafetyReportRow) => row.id,
    loading: reportsQuery.isLoading,
    searchable: true,
  });

  if (!projectId) {
    return null;
  }

  return (
    <Box>
      {reportsQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
        </Alert>
      ) : null}

      <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          {t("filtersTitle")}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label={tFilters("reference")}
              value={filters.reference}
              onChange={(e) => updateFilter("reference", e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("contractor")}
              value={filters.contractor}
              onChange={(e) => updateFilter("contractor", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {contractorOptions.map((contractor) => (
                <MenuItem key={contractor} value={contractor}>
                  {contractor}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("consultant")}
              value={filters.consultant}
              onChange={(e) => updateFilter("consultant", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {consultantOptions.map((consultant) => (
                <MenuItem key={consultant} value={consultant}>
                  {consultant}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("engineer")}
              value={filters.engineer}
              onChange={(e) => updateFilter("engineer", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {engineerOptions.map((engineer) => (
                <MenuItem key={engineer} value={engineer}>
                  {engineer}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <SafetyReportsTableLayout
        filters={
          <SafetyReportsTableLayout.TopActions
            state={state}
            customActions={
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleClearFilters}
                >
                  {t("clearFilters")}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadOutlined />}
                  onClick={handleExport}
                >
                  {t("export")}
                </Button>
              </Stack>
            }
          />
        }
        table={
          <Box sx={{ overflowX: "auto" }}>
            <SafetyReportsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 8 }}
            />
          </Box>
        }
        pagination={<SafetyReportsTableLayout.Pagination state={state} />}
      />
    </Box>
  );
}
