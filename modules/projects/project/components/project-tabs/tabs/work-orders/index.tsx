"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { FileDownloadOutlined } from "@mui/icons-material";

import { Plus } from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import HeadlessTableLayout from "@/components/headless/table";

import CustomMenu from "@/components/headless/custom-menu";

import { useProject } from "@/modules/all-project/context/ProjectContext";

import {
  projectOrderPermitsQueryKey,
  useProjectOrderPermits,
} from "@/modules/projects/project/query/useProjectOrderPermits";
import { useUpdateOrderPermit } from "@/modules/projects/project/query/useUpdateOrderPermit";

import { ProjectOrderPermitsApi } from "@/services/api/projects/project-order-permits";

import AddWorkOrderDialog from "./add-work-order/AddWorkOrderDialog";
import { PerRowEditablePermitCell, type EditablePermitField } from "./EditablePermitCell";

import type { WorkOrderFilters, WorkOrderRow } from "./types";

import {
  EMPTY_WORK_ORDER_FILTERS,
  WORK_ORDER_COLUMN_KEYS,
  type WorkOrderColumnKey,
} from "./types";

const WorkOrdersTableLayout = HeadlessTableLayout<WorkOrderRow>("work-orders");

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

function formatPrice(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,

    maximumFractionDigits: 2,
  });
}

function filterWorkOrders(
  rows: WorkOrderRow[],

  filters: WorkOrderFilters,
): WorkOrderRow[] {
  return rows.filter((row) => {
    if (
      filters.workOrderId &&
      !row.workOrderId

        .toLowerCase()

        .includes(filters.workOrderId.trim().toLowerCase())
    ) {
      return false;
    }

    if (filters.workOrderType && row.workOrderType !== filters.workOrderType) {
      return false;
    }

    if (
      filters.location &&
      !row.location
        .toLowerCase()
        .includes(filters.location.trim().toLowerCase())
    ) {
      return false;
    }

    if (filters.contractor && row.contractor !== filters.contractor) {
      return false;
    }

    if (
      filters.assignmentStartDate &&
      row.assignmentDate < filters.assignmentStartDate
    ) {
      return false;
    }

    if (
      filters.assignmentEndDate &&
      row.assignmentDate > filters.assignmentEndDate
    ) {
      return false;
    }

    return true;
  });
}

const WORK_ORDER_DATE_COLUMN_KEYS = new Set<WorkOrderColumnKey>([
  "assignmentDate",
  "consultantAssignmentDate",
  "consultantLastProcedureDate",
  "consultantColumn155EntryDate",
  "contractorLastProcedureDate",
  "contractorColumn155EntryDate",
  "startPermitDate",
  "endPermitDate",
  "lastDateConsultantStatement",
]);

const PERMIT_EDITABLE_COLUMN_KEYS = new Set<WorkOrderColumnKey>([
  "permitStatus",
  "startPermitDate",
  "endPermitDate",
  "noteFromPermitToDepartments",
  "isTakedAction",
]);

const NON_PERMIT_COLUMN_KEYS = new Set<WorkOrderColumnKey>([
  "employeeName",
  "completionPhase",
  "phaseStatus",
  "targetDrilling",
  "achievedDrilling",
  "targetExtention",
  "achievedExtention",
  "descriptionDetails",
  "consultantStatement",
  "lastDateConsultantStatement",
  "consultnatStatementStatus",
  "officialProjectHours",
  "numberOfDaysToAchieveColumn155",
  "percentageTime",
  "percentageAchieveDrilling",
  "percentageAchieveExtention",
]);

const PROJECT_EDITABLE_COLUMN_KEYS = new Set<WorkOrderColumnKey>([
  "employeeName",
  "completionPhase",
  "phaseStatus",
  "targetDrilling",
  "achievedDrilling",
  "targetExtention",
  "achievedExtention",
  "descriptionDetails",
  "consultantStatement",
  "lastDateConsultantStatement",
]);

function renderWorkOrderCell(
  row: WorkOrderRow,

  key: WorkOrderColumnKey,

  emptyDash: string,
) {
  if (key === "actions") {
    return null;
  }

  if (key === "permitStatus") {
    return <span>{row.permitStatusName || emptyDash}</span>;
  }

  if (key === "isTakedAction") {
    return <Checkbox checked={row.isTakedAction === "yes"} size="small" sx={{ padding: "4px" }} disabled />;
  }

  if (key === "completionPhase") {
    return <span>{row.completionPhaseName || emptyDash}</span>;
  }

  if (key === "phaseStatus") {
    return <span>{row.phaseStatusName || emptyDash}</span>;
  }

  if (WORK_ORDER_DATE_COLUMN_KEYS.has(key)) {
    const formatted = formatDisplayDate(String(row[key]));

    return <span>{formatted || emptyDash}</span>;
  }

  if (key === "price" || key === "consultantPrice") {
    const amount = row[key];

    if (!amount) {
      return <span>{emptyDash}</span>;
    }

    return <span>{formatPrice(amount)}</span>;
  }

  const value = row[key];

  if (value === null || value === undefined || value === "") {
    return <span>{emptyDash}</span>;
  }

  return <span>{String(value)}</span>;
}

export default function WorkOrdersTab({
  departmentId,
  isEditable = false,
  isProjectEditable = false,
}: {
  departmentId?: number;
  isEditable?: boolean;
  isProjectEditable?: boolean;
} = {}) {
  const { projectId } = useProject();

  const queryClient = useQueryClient();

  const t = useTranslations("project.workOrdersTab");

  const tFilters = useTranslations("project.workOrdersTab.filters");

  const tTable = useTranslations("project.workOrdersTab.table");

  const tFields = useTranslations("project.workOrdersTab.dialog.fields");

  const emptyDash = t("emptyDash");
  const yesLabel = t("yes");
  const noLabel = t("no");

  const [filters, setFilters] = useState<WorkOrderFilters>(
    EMPTY_WORK_ORDER_FILTERS,
  );

  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [isImporting, setIsImporting] = useState(false);

  const importFileInputRef = useRef<HTMLInputElement>(null);

  const params = WorkOrdersTableLayout.useTableParams({
    initialPage: 1,

    initialLimit: 10,
  });

  const workOrdersQuery = useProjectOrderPermits(projectId, departmentId);

  const allRows = useMemo(
    () => workOrdersQuery.data ?? [],
    [workOrdersQuery.data],
  );

  const updatePermitMutation = useUpdateOrderPermit(projectId);

  const handlePermitSave = useCallback(
    (id: string, body: Record<string, unknown>) => {
      if (!projectId) return;
      updatePermitMutation.mutate(
        { id, body },
        {
          onSuccess: (res) => {
            toast.success(res.data?.message ?? t("importSuccess"));
          },
          onError: (err: unknown) => {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error?.response?.data?.message ?? t("importError"));
          },
        },
      );
    },
    [projectId, updatePermitMutation, t],
  );

  const workOrderTypeOptions = useMemo(
    () => [...new Set(allRows.map((row) => row.workOrderType).filter(Boolean))],

    [allRows],
  );

  const contractorOptions = useMemo(
    () => [...new Set(allRows.map((row) => row.contractor).filter(Boolean))],

    [allRows],
  );

  const filteredRows = useMemo(
    () => filterWorkOrders(allRows, filters),

    [allRows, filters],
  );

  const totalItems = filteredRows.length;

  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;

    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const updateFilter = <K extends keyof WorkOrderFilters>(
    key: K,

    value: WorkOrderFilters[K],
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    params.setPage(1);
  };

  const columnLabels: Record<
    Exclude<WorkOrderColumnKey, "actions">,
    string
  > = useMemo(
    () => ({
      workOrderId: tFields("workOrderId"),

      workOrderType: tFields("workOrderType"),

      consultantWorkOrderType: tFields("consultantWorkOrderType"),

      departmentName: tFields("departmentName"),

      orderPermitDescription: tFields("orderPermitDescription"),

      orderPermitTypeName: tFields("orderPermitTypeName"),

      udsPeriod: tFields("udsPeriod"),

      assignmentDate: tFields("assignmentDate"),

      contractor: tFields("contractor"),

      management: tFields("management"),

      location: tFields("location"),

      latitude: tFields("latitude"),

      longitude: tFields("longitude"),

      price: tFields("price"),

      executingEntity: tFields("executingEntity"),

      office: tFields("office"),

      consultantCurrentBasket: tFields("consultantCurrentBasket"),

      consultantAssignmentDate: tFields("consultantAssignmentDate"),

      consultantLastProcedureCode: tFields("consultantLastProcedureCode"),

      consultantLastProcedureDate: tFields("consultantLastProcedureDate"),

      consultantColumn155EntryDate: tFields("consultantColumn155EntryDate"),

      contractorLastProcedureCode: tFields("contractorLastProcedureCode"),

      contractorLastProcedureDate: tFields("contractorLastProcedureDate"),

      contractorColumn155EntryDate: tFields("contractorColumn155EntryDate"),

      materialBalanceElecContractor: tFields("materialBalanceElecContractor"),

      contractorWorkOrderStatus: tFields("contractorWorkOrderStatus"),

      contractorBasket: tFields("contractorBasket"),

      consultantPrice: tFields("consultantPrice"),

      permitStatus: tFields("permitStatus"),

      startPermitDate: tFields("startPermitDate"),

      endPermitDate: tFields("endPermitDate"),

      noteFromPermitToDepartments: tFields("noteFromPermitToDepartments"),

      isTakedAction: tFields("isTakedAction"),

      countOfDaysFromAssignedDate: tFields("countOfDaysFromAssignedDate"),

      evaluationPermitStatus: tFields("evaluationPermitStatus"),

      employeeName: tFields("employeeName"),

      completionPhase: tFields("completionPhase"),

      phaseStatus: tFields("phaseStatus"),

      targetDrilling: tFields("targetDrilling"),

      achievedDrilling: tFields("achievedDrilling"),

      targetExtention: tFields("targetExtention"),

      achievedExtention: tFields("achievedExtention"),

      descriptionDetails: tFields("descriptionDetails"),

      consultantStatement: tFields("consultantStatement"),

      lastDateConsultantStatement: tFields("lastDateConsultantStatement"),

      consultnatStatementStatus: tFields("consultnatStatementStatus"),

      officialProjectHours: tFields("officialProjectHours"),

      numberOfDaysToAchieveColumn155: tFields("numberOfDaysToAchieveColumn155"),

      percentageTime: tFields("percentageTime"),

      percentageAchieveDrilling: tFields("percentageAchieveDrilling"),

      percentageAchieveExtention: tFields("percentageAchieveExtention"),
    }),

    [tFields],
  );

  const columns = useMemo(
    () =>
      WORK_ORDER_COLUMN_KEYS.filter(
        (key) => !(isEditable && NON_PERMIT_COLUMN_KEYS.has(key)),
      ).map((key) => {
        if (key === "actions") {
          return {
            key,

            name: tTable("actions"),

            sortable: false,

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
                <MenuItem onClick={() => {}}>{tTable("view")}</MenuItem>

                <MenuItem onClick={() => {}}>{tTable("edit")}</MenuItem>
              </CustomMenu>
            ),
          };
        }

        return {
          key,

          name: columnLabels[key],

          sortable: false,

          render: (row: WorkOrderRow) => {
            if (isEditable && PERMIT_EDITABLE_COLUMN_KEYS.has(key)) {
              return (
                <PerRowEditablePermitCell
                  row={row}
                  field={key as EditablePermitField}
                  emptyDash={emptyDash}
                  yesLabel={yesLabel}
                  noLabel={noLabel}
                  onSave={handlePermitSave}
                />
              );
            }

            if (isProjectEditable && PROJECT_EDITABLE_COLUMN_KEYS.has(key)) {
              return (
                <PerRowEditablePermitCell
                  row={row}
                  field={key as EditablePermitField}
                  emptyDash={emptyDash}
                  yesLabel={yesLabel}
                  noLabel={noLabel}
                  onSave={handlePermitSave}
                />
              );
            }

            if (key === "permitStatus") {
              return (
                <span>{row.permitStatusName || emptyDash}</span>
              );
            }

            if (key === "isTakedAction") {
              return <Checkbox checked={row.isTakedAction === "yes"} size="small" sx={{ padding: "4px" }} disabled />;
            }

            return renderWorkOrderCell(row, key, emptyDash);
          },
        };
      }),

    [columnLabels, tTable, emptyDash, isEditable, isProjectEditable, handlePermitSave, yesLabel, noLabel],
  );

  const handleExport = () => {
    // TODO: export when API is available
  };

  const handleRecentlyAdded = () => {
    // TODO: filter recently added work orders when backend is ready
    window.location.reload();
  };

  const state = WorkOrdersTableLayout.useTableState({
    data: pageData,

    columns,

    totalPages,

    totalItems,

    params,

    selectable: true,

    getRowId: (row: WorkOrderRow) => row.id,

    loading: workOrdersQuery.isLoading,
  });

  const handleWorkOrdersCreated = () => {
    if (!projectId) return;

    queryClient.invalidateQueries({
      queryKey: ["project-order-permits", projectId],
    });
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

    if (!file || !projectId) return;

    if (!isExcelFile(file)) {
      toast.error(t("invalidImportFile"));
      return;
    }

    setIsImporting(true);
    try {
      const res = await ProjectOrderPermitsApi.import(projectId, file);
      toast.success(res.data?.message ?? t("importSuccess"));
      await queryClient.invalidateQueries({
        queryKey: projectOrderPermitsQueryKey(projectId),
      });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message ?? t("importError"));
    } finally {
      setIsImporting(false);
    }
  };

  if (!projectId) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        {t("title")}
      </Typography>

      {workOrdersQuery.isError ? (
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
              label={tFilters("workOrderId")}
              value={filters.workOrderId}
              onChange={(e) => updateFilter("workOrderId", e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("workOrderType")}
              value={filters.workOrderType}
              onChange={(e) => updateFilter("workOrderType", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>

              {workOrderTypeOptions.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label={tFilters("location")}
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label={tFilters("assignmentStartDate")}
              type="date"
              value={filters.assignmentStartDate}
              onChange={(e) =>
                updateFilter("assignmentStartDate", e.target.value)
              }
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label={tFilters("assignmentEndDate")}
              type="date"
              value={filters.assignmentEndDate}
              onChange={(e) =>
                updateFilter("assignmentEndDate", e.target.value)
              }
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
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
        </Grid>
      </Paper>

      <WorkOrdersTableLayout
        filters={
          <WorkOrdersTableLayout.TopActions
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
                      <FileDownloadOutlined />
                    )
                  }
                  disabled={isImporting}
                  onClick={handleImportClick}
                >
                  {t("refreshFromUds")}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setAddDialogOpen(true)}
                >
                  {t("addWorkOrder")}
                </Button>

                <Button variant="outlined" onClick={handleRecentlyAdded}>
                  {t("recentlyAdded")}
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
            <WorkOrdersTableLayout.Table
              state={state}
              loadingOptions={{ rows: 8 }}
            />
          </Box>
        }
        pagination={<WorkOrdersTableLayout.Pagination state={state} />}
      />

      <AddWorkOrderDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onCreated={handleWorkOrdersCreated}
      />
    </Box>
  );
}
