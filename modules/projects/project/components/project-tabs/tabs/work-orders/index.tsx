"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { FileDownloadOutlined, PrintOutlined } from "@mui/icons-material";
import { Plus } from "lucide-react";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import { useProject } from "@/modules/all-project/context/ProjectContext";
import AddWorkOrderDialog from "./add-work-order/AddWorkOrderDialog";
import type { WorkOrderFilters, WorkOrderRow } from "./types";
import {
  EMPTY_WORK_ORDER_FILTERS,
  WORK_ORDER_COLUMN_KEYS,
  type WorkOrderColumnKey,
} from "./types";

const WorkOrdersTableLayout = HeadlessTableLayout<WorkOrderRow>("work-orders");

const NUMERIC_COLUMN_KEYS = new Set<WorkOrderColumnKey>([
  "price",
  "indebtedness",
  "defaultValue",
  "availableBalance",
  "cashBalance",
  "posMachinesCount",
  "pcMachinesCount",
  "totalMachinesCount",
  "simLinesCount",
  "pcSimLinesCount",
  "totalLinesCount",
  "value",
]);

function formatNumber(value: number) {
  return value.toLocaleString("en-US");
}

function filterWorkOrders(
  rows: WorkOrderRow[],
  filters: WorkOrderFilters,
): WorkOrderRow[] {
  return rows.filter((row) => {
    if (
      filters.contractCode &&
      !row.contractCode.includes(filters.contractCode.trim())
    ) {
      return false;
    }
    if (filters.type && row.type !== filters.type) {
      return false;
    }
    if (
      filters.stationName &&
      !row.stationName
        .toLowerCase()
        .includes(filters.stationName.trim().toLowerCase())
    ) {
      return false;
    }
    if (
      filters.contractingParty &&
      row.contractingParty !== filters.contractingParty
    ) {
      return false;
    }
    if (filters.paymentStatus && row.paymentStatus !== filters.paymentStatus) {
      return false;
    }
    if (
      filters.projectStartDate &&
      row.dataUpdatedAt < filters.projectStartDate
    ) {
      return false;
    }
    if (filters.projectEndDate && row.dataUpdatedAt > filters.projectEndDate) {
      return false;
    }
    return true;
  });
}

function renderWorkOrderCell(
  row: WorkOrderRow,
  key: WorkOrderColumnKey,
  emptyDash: string,
  yesLabel: string,
  noLabel: string,
) {
  if (key === "serial") {
    return <span>{row.serial}</span>;
  }

  if (key === "active") {
    return (
      <Chip
        label={row.active ? yesLabel : noLabel}
        size="small"
        color={row.active ? "success" : "default"}
        sx={{ fontWeight: 600, minWidth: 56 }}
      />
    );
  }

  const value = row[key as keyof WorkOrderRow];

  if (value === null || value === undefined || value === "") {
    return <span>{emptyDash}</span>;
  }

  if (typeof value === "number" && NUMERIC_COLUMN_KEYS.has(key)) {
    return <span>{formatNumber(value)}</span>;
  }

  return <span>{String(value)}</span>;
}

export default function WorkOrdersTab() {
  const { projectId } = useProject();
  const t = useTranslations("project.workOrdersTab");
  const tFilters = useTranslations("project.workOrdersTab.filters");
  const tTable = useTranslations("project.workOrdersTab.table");
  const emptyDash = t("emptyDash");

  const [draftFilters, setDraftFilters] =
    useState<WorkOrderFilters>(EMPTY_WORK_ORDER_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<WorkOrderFilters>(EMPTY_WORK_ORDER_FILTERS);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const params = WorkOrdersTableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const filteredRows = useMemo(
    () => filterWorkOrders([], appliedFilters),
    [appliedFilters],
  );

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  const pageData = useMemo(() => {
    const start = (params.page - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit]);

  const updateDraftFilter = <K extends keyof WorkOrderFilters>(
    key: K,
    value: WorkOrderFilters[K],
  ) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    setAppliedFilters({ ...draftFilters });
    params.setPage(1);
  };

  const handleReset = () => {
    setDraftFilters(EMPTY_WORK_ORDER_FILTERS);
    setAppliedFilters(EMPTY_WORK_ORDER_FILTERS);
    params.setPage(1);
  };

  const columns = useMemo(
    () =>
      WORK_ORDER_COLUMN_KEYS.map((key) => {
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
          name: tTable(key),
          sortable: false,
          render: (row: WorkOrderRow) =>
            renderWorkOrderCell(row, key, emptyDash, t("yes"), t("no")),
        };
      }),
    [tTable, emptyDash, t],
  );

  const state = WorkOrdersTableLayout.useTableState({
    data: pageData,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: WorkOrderRow) => row.id,
    loading: false,
    onExport: async () => {
      // TODO: export when API is available
    },
  });

  if (!projectId) {
    return null;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        {t("title")}
      </Typography>

      <Paper variant="outlined" sx={{ p: 2.5, mb: 2, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
          {t("filtersTitle")}
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label={tFilters("contractCode")}
              value={draftFilters.contractCode}
              onChange={(e) => updateDraftFilter("contractCode", e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("type")}
              value={draftFilters.type}
              onChange={(e) => updateDraftFilter("type", e.target.value)}
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label={tFilters("stationName")}
              value={draftFilters.stationName}
              onChange={(e) => updateDraftFilter("stationName", e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label={tFilters("projectStartDate")}
              type="date"
              value={draftFilters.projectStartDate}
              onChange={(e) =>
                updateDraftFilter("projectStartDate", e.target.value)
              }
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              label={tFilters("projectEndDate")}
              type="date"
              value={draftFilters.projectEndDate}
              onChange={(e) =>
                updateDraftFilter("projectEndDate", e.target.value)
              }
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("contractingParty")}
              value={draftFilters.contractingParty}
              onChange={(e) =>
                updateDraftFilter("contractingParty", e.target.value)
              }
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <TextField
              select
              label={tFilters("paymentStatus")}
              value={draftFilters.paymentStatus}
              onChange={(e) =>
                updateDraftFilter("paymentStatus", e.target.value)
              }
              fullWidth
              size="small"
            >
              <MenuItem value="">{t("all")}</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="flex-end"
          sx={{ mt: 2.5 }}
        >
          <Button variant="outlined" onClick={handleReset}>
            {t("reset")}
          </Button>
          <Button variant="contained" color="secondary" onClick={handleSearch}>
            {t("search")}
          </Button>
        </Stack>
      </Paper>

      <WorkOrdersTableLayout
        filters={
          <WorkOrdersTableLayout.TopActions
            state={state}
            customActions={
              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setAddDialogOpen(true)}
                >
                  {t("addWorkOrder")}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadOutlined />}
                  onClick={() => state.actions.onExport?.()}
                >
                  {t("export")}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PrintOutlined />}
                  onClick={() => window.print()}
                >
                  {t("print")}
                </Button>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  {t("totalCount")} : {totalItems}
                </Typography>
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
      />
    </Box>
  );
}
