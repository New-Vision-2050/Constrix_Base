"use client";

import { useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FileDownloadOutlined, FileUploadOutlined } from "@mui/icons-material";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import HeadlessTableLayout from "@/components/headless/table";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import { useProjectContractors } from "@/modules/projects/project/query/useProjectContractors";
import { useProjectEmployees } from "@/modules/projects/project/query/useProjectEmployees";
import { useSafetyVisits } from "../query/useSafetyVisits";
import {
  EMPTY_SAFETY_VISIT_FILTERS,
  type SafetyViolation,
  type SafetyVisitFilters,
  type SafetyVisitRow,
} from "../types";
import SafetyViolationEvidenceDialog from "./SafetyViolationEvidenceDialog";
import ViolationCell from "./ViolationCell";
import {
  SAFETY_VIOLATIONS_CATALOG,
  SAFETY_VIOLATION_EMPTY_VALUE,
} from "../constants/safetyViolations";
import WorkOrderTypeBadge from "./WorkOrderTypeBadge";
import PercentageCell from "./PercentageCell";

const SafetyVisitsTableLayout = HeadlessTableLayout<SafetyVisitRow>(
  "safety-visits",
);

const EXCEL_FILE_ACCEPT =
  ".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function isExcelFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".xls") ||
    name.endsWith(".xlsx") ||
    file.type === "application/vnd.ms-excel" ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

function formatGrade(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 4,
    maximumFractionDigits: 5,
  });
}

export default function SafetyVisitsView() {
  const { projectId } = useProject();
  const t = useTranslations("project.safetyTab.visits");
  const tTable = useTranslations("project.safetyTab.visits.table");
  const tFilters = useTranslations("project.safetyTab.visits.filters");

  const [filters, setFilters] = useState<SafetyVisitFilters>(
    EMPTY_SAFETY_VISIT_FILTERS,
  );
  const [isImporting, setIsImporting] = useState(false);
  const [evidenceDialog, setEvidenceDialog] = useState<{
    violation: SafetyViolation;
    workOrderNumber: string;
  } | null>(null);
  const importFileInputRef = useRef<HTMLInputElement>(null);

  const params = SafetyVisitsTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const safetyQuery = useSafetyVisits({
    projectId,
    page: params.page,
    perPage: params.limit,
    search: params.search || undefined,
    filters,
  });
  const contractorsQuery = useProjectContractors(projectId);
  const employeesQuery = useProjectEmployees(projectId);

  const rows = useMemo(() => safetyQuery.data?.data ?? [], [safetyQuery.data]);
  const totalPages = safetyQuery.data?.pagination.last_page ?? 1;
  const totalItems = safetyQuery.data?.pagination.result_count ?? rows.length;

  const consultantOptions = useMemo(
    () =>
      [...new Set(rows.map((row) => row.consultant).filter(Boolean))].sort(),
    [rows],
  );

  const engineerOptions = useMemo(
    () =>
      [
        ...new Set(rows.map((row) => row.consultantEngineer).filter(Boolean)),
      ].sort(),
    [rows],
  );

  const updateFilter = <K extends keyof SafetyVisitFilters>(
    key: K,
    value: SafetyVisitFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    params.setPage(1);
  };

  const handleClearFilters = () => {
    setFilters(EMPTY_SAFETY_VISIT_FILTERS);
    params.setSearch("");
    params.setPage(1);
  };

  const handleExport = () => {
    toast.info(t("exportComingSoon"));
  };

  const handleAddWorkOrder = () => {
    toast.info(t("addWorkOrderComingSoon"));
  };

  const handleImportClick = () => {
    if (isImporting) return;
    importFileInputRef.current?.click();
  };

  const handleImportFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isExcelFile(file)) {
      toast.error(t("invalidImportFile"));
      return;
    }

    setIsImporting(true);
    try {
      toast.info(t("importComingSoon"));
    } finally {
      setIsImporting(false);
    }
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        key: "workOrderNumber",
        name: tTable("workOrderNumber"),
        sortable: false,
        minWidth: 160,
        render: (row: SafetyVisitRow) => (
          <span className="font-medium">{row.workOrderNumber}</span>
        ),
      },
      {
        key: "workOrderType",
        name: tTable("workOrderType"),
        sortable: false,
        minWidth: 120,
        render: (row: SafetyVisitRow) => (
          <WorkOrderTypeBadge label={row.workOrderType} />
        ),
      },
      {
        key: "date",
        name: tTable("date"),
        sortable: false,
        minWidth: 110,
        render: (row: SafetyVisitRow) => (
          <span>{formatDisplayDate(row.date)}</span>
        ),
      },
      {
        key: "requiredGrade",
        name: tTable("requiredGrade"),
        sortable: false,
        minWidth: 120,
        render: (row: SafetyVisitRow) => (
          <span>{formatGrade(row.requiredGrade)}</span>
        ),
      },
      {
        key: "earnedGrade",
        name: tTable("earnedGrade"),
        sortable: false,
        minWidth: 120,
        render: (row: SafetyVisitRow) => (
          <span>{formatGrade(row.earnedGrade)}</span>
        ),
      },
      {
        key: "percentage",
        name: tTable("percentage"),
        sortable: false,
        minWidth: 100,
        render: (row: SafetyVisitRow) => (
          <PercentageCell value={row.percentage} />
        ),
      },
      {
        key: "consultantEngineer",
        name: tTable("consultantEngineer"),
        sortable: false,
        minWidth: 140,
        render: (row: SafetyVisitRow) => <span>{row.consultantEngineer}</span>,
      },
      {
        key: "consultant",
        name: tTable("consultant"),
        sortable: false,
        minWidth: 140,
        render: (row: SafetyVisitRow) => <span>{row.consultant}</span>,
      },
      {
        key: "contractorName",
        name: tTable("contractor"),
        sortable: false,
        minWidth: 160,
        render: (row: SafetyVisitRow) => (
          <span>{row.contractorName || "—"}</span>
        ),
      },
    ];

    const violationColumns = SAFETY_VIOLATIONS_CATALOG.map((definition) => ({
      key: `violation-${definition.code}`,
      name: definition.description,
      sortable: false,
      align: "center" as const,
      minWidth: 220,
      render: (row: SafetyVisitRow) => {
        const violation = row.violations.find(
          (item) => item.code === definition.code,
        );
        const value =
          row.violationValues[definition.code] ?? SAFETY_VIOLATION_EMPTY_VALUE;

        return (
          <ViolationCell
            value={value}
            violation={violation}
            onOpenEvidence={(selectedViolation) =>
              setEvidenceDialog({
                violation: selectedViolation,
                workOrderNumber: row.workOrderNumber,
              })
            }
          />
        );
      },
    }));

    return [...baseColumns, ...violationColumns];
  }, [tTable]);

  const state = SafetyVisitsTableLayout.useTableState({
    data: rows,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: SafetyVisitRow) => row.id,
    loading: safetyQuery.isLoading || safetyQuery.isFetching,
    searchable: false,
  });

  if (!projectId) {
    return null;
  }

  return (
    <Box>
      {safetyQuery.isError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError")}
        </Alert>
      ) : null}
      <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          {t("filtersTitle")}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              label={tFilters("search")}
              value={params.search}
              onChange={(e) => {
                params.setSearch(e.target.value);
                params.setPage(1);
              }}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              select
              label={tFilters("contractor")}
              value={filters.contractorId}
              onChange={(e) => updateFilter("contractorId", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {(contractorsQuery.data ?? []).map((contractor) => (
                <MenuItem key={contractor.id} value={String(contractor.id)}>
                  {contractor.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
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

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              select
              label={tFilters("engineer")}
              value={filters.consultantEngineer}
              onChange={(e) => updateFilter("consultantEngineer", e.target.value)}
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

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              label={tFilters("date")}
              type="date"
              value={filters.date}
              onChange={(e) => updateFilter("date", e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <TextField
              select
              label={tFilters("assignedUser")}
              value={filters.assignedUserId}
              onChange={(e) => updateFilter("assignedUserId", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
              {(employeesQuery.data ?? []).map((employee) => (
                <MenuItem key={employee.user.id} value={employee.user.id}>
                  {employee.user.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <SafetyVisitsTableLayout
        filters={
          <SafetyVisitsTableLayout.TopActions
            state={state}
            customActions={
              <Stack direction="row" spacing={1} alignItems="center">
                <input
                  ref={importFileInputRef}
                  type="file"
                  accept={EXCEL_FILE_ACCEPT}
                  hidden
                  onChange={handleImportFileChange}
                />
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={
                    isImporting ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <FileUploadOutlined />
                    )
                  }
                  disabled={isImporting}
                  onClick={handleImportClick}
                >
                  {t("uploadExcel")}
                </Button>
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
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Plus className="w-4 h-4" />}
                  onClick={handleAddWorkOrder}
                >
                  {t("addWorkOrder")}
                </Button>
              </Stack>
            }
          />
        }
        table={
          <Box sx={{ overflowX: "auto" }}>
            <SafetyVisitsTableLayout.Table
              state={state}
              loadingOptions={{ rows: 8 }}
            />
          </Box>
        }
        pagination={<SafetyVisitsTableLayout.Pagination state={state} />}
      />

      <SafetyViolationEvidenceDialog
        open={evidenceDialog !== null}
        onClose={() => setEvidenceDialog(null)}
        violation={evidenceDialog?.violation ?? null}
        workOrderNumber={evidenceDialog?.workOrderNumber}
      />
    </Box>
  );
}
