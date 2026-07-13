"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ExternalLink, EyeIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import HeadlessTableLayout from "@/components/headless/table";
import CustomMenu from "@/components/headless/custom-menu";
import RequirementStatsCards from "./RequirementStatsCards";
import SubmissionStatusBadge from "./SubmissionStatusBadge";
import {
  DOCUMENT_REQUIREMENT_MOCK_ROWS,
  DOCUMENT_REQUIREMENT_STATS,
} from "../constants/mock-data";
import type { DocumentRequirementRow } from "../types";

const TableLayout = HeadlessTableLayout<DocumentRequirementRow>(
  "document-requirements-table",
);

const filterSx = {
  flex: 1,
  minWidth: 160,
  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
} as const;

function CompletionCell({ percent }: { percent: number }) {
  const color =
    percent >= 70 ? "#22C55E" : percent >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
      <Typography
        component="span"
        sx={{ fontWeight: 600, color, fontSize: "0.875rem" }}
      >
        {percent}%
      </Typography>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={100}
          size={22}
          thickness={5}
          sx={{ color: "action.hover", position: "absolute" }}
        />
        <CircularProgress
          variant="determinate"
          value={percent}
          size={22}
          thickness={5}
          sx={{ color }}
        />
      </Box>
    </Box>
  );
}

export default function DocumentRequirementsTable() {
  const t = useTranslations("project.documentRequirements");

  const [filterSpecialization, setFilterSpecialization] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterPhase, setFilterPhase] = useState("");
  const [filterEntity, setFilterEntity] = useState("");

  const params = TableLayout.useTableParams({
    initialPage: 1,
    initialLimit: 10,
  });

  const specializations = useMemo(
    () =>
      Array.from(
        new Set(DOCUMENT_REQUIREMENT_MOCK_ROWS.map((r) => r.specialization)),
      ),
    [],
  );
  const documentTypes = useMemo(
    () =>
      Array.from(
        new Set(DOCUMENT_REQUIREMENT_MOCK_ROWS.map((r) => r.documentType)),
      ),
    [],
  );
  const phases = useMemo(
    () =>
      Array.from(new Set(DOCUMENT_REQUIREMENT_MOCK_ROWS.map((r) => r.phase))),
    [],
  );
  const entities = useMemo(
    () =>
      Array.from(
        new Set(
          DOCUMENT_REQUIREMENT_MOCK_ROWS.flatMap((r) => [
            r.sendingEntity,
            r.reviewingEntity,
          ]),
        ),
      ),
    [],
  );

  const filteredRows = useMemo(() => {
    const search = params.search.trim().toLowerCase();
    return DOCUMENT_REQUIREMENT_MOCK_ROWS.filter((row) => {
      if (filterSpecialization && row.specialization !== filterSpecialization) {
        return false;
      }
      if (filterType && row.documentType !== filterType) return false;
      if (filterPhase && row.phase !== filterPhase) return false;
      if (
        filterEntity &&
        row.sendingEntity !== filterEntity &&
        row.reviewingEntity !== filterEntity
      ) {
        return false;
      }
      if (!search) return true;
      return (
        row.requirementCode.toLowerCase().includes(search) ||
        row.requiredDocumentName.toLowerCase().includes(search) ||
        row.document.toLowerCase().includes(search) ||
        row.documentType.toLowerCase().includes(search) ||
        row.linkedDocument.toLowerCase().includes(search)
      );
    });
  }, [
    filterSpecialization,
    filterType,
    filterPhase,
    filterEntity,
    params.search,
  ]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / params.limit));

  useEffect(() => {
    if (params.page > totalPages) {
      params.setPage(totalPages);
    }
  }, [params.page, params.setPage, totalPages]);

  const data = useMemo(() => {
    const safePage = Math.min(params.page, totalPages);
    const start = (safePage - 1) * params.limit;
    return filteredRows.slice(start, start + params.limit);
  }, [filteredRows, params.page, params.limit, totalPages]);

  const clearFilters = () => {
    setFilterSpecialization("");
    setFilterType("");
    setFilterPhase("");
    setFilterEntity("");
    params.setSearch("");
    params.setPage(1);
  };

  const columns = useMemo(
    () => [
      {
        key: "requirementCode",
        name: t("requirementCode"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <span>{row.requirementCode}</span>
        ),
      },
      {
        key: "requiredDocumentName",
        name: t("requiredDocumentName"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <span>{row.requiredDocumentName}</span>
        ),
      },
      {
        key: "document",
        name: t("document"),
        sortable: false,
        render: (row: DocumentRequirementRow) => <span>{row.document}</span>,
      },
      {
        key: "documentType",
        name: t("documentType"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <Typography component="span" sx={{ color: "#38BDF8", fontWeight: 500 }}>
            {row.documentType}
          </Typography>
        ),
      },
      {
        key: "specialization",
        name: t("specialization"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <span>{row.specialization}</span>
        ),
      },
      {
        key: "phase",
        name: t("phase"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <Typography component="span" sx={{ color: "#22C55E", fontWeight: 500 }}>
            {row.phase}
          </Typography>
        ),
      },
      {
        key: "sendingEntity",
        name: t("sendingEntity"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <Typography component="span" sx={{ color: "#38BDF8", fontWeight: 500 }}>
            {row.sendingEntity}
          </Typography>
        ),
      },
      {
        key: "reviewingEntity",
        name: t("reviewingEntity"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <Typography component="span" sx={{ color: "#A78BFA", fontWeight: 500 }}>
            {row.reviewingEntity}
          </Typography>
        ),
      },
      {
        key: "frequency",
        name: t("frequency"),
        sortable: false,
        render: (row: DocumentRequirementRow) => <span>{row.frequency}</span>,
      },
      {
        key: "submissionStatus",
        name: t("submissionStatus"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <SubmissionStatusBadge status={row.submissionStatus} />
        ),
      },
      {
        key: "linkedDocument",
        name: t("linkedDocument"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              color: "text.primary",
            }}
          >
            <span>{row.linkedDocument}</span>
            <ExternalLink size={14} />
          </Box>
        ),
      },
      {
        key: "completionPercent",
        name: t("completionPercent"),
        sortable: false,
        render: (row: DocumentRequirementRow) => (
          <CompletionCell percent={row.completionPercent} />
        ),
      },
      {
        key: "actions",
        name: t("actions"),
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
                {t("action")}
              </Button>
            )}
          >
            <Button
              size="small"
              sx={{ width: "100%", justifyContent: "flex-start", px: 2 }}
            >
              {t("view")}
              <EyeIcon className="h-4 w-4 ms-2" />
            </Button>
          </CustomMenu>
        ),
      },
    ],
    [t],
  );

  const state = TableLayout.useTableState({
    data,
    columns,
    totalPages,
    totalItems,
    params,
    selectable: true,
    getRowId: (row: DocumentRequirementRow) => row.id,
    loading: false,
    searchable: true,
    onExport: async () => {},
  });

  return (
    <Box>
      <RequirementStatsCards stats={DOCUMENT_REQUIREMENT_STATS} />

      <TableLayout
        filters={
          <Stack spacing={2}>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <TextField
                select
                size="small"
                label={t("specialization")}
                value={filterSpecialization}
                onChange={(e) => {
                  setFilterSpecialization(e.target.value);
                  params.setPage(1);
                }}
                sx={filterSx}
              >
                <MenuItem value="">{t("allSpecializations")}</MenuItem>
                {specializations.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label={t("documentType")}
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  params.setPage(1);
                }}
                sx={filterSx}
              >
                <MenuItem value="">{t("allTypes")}</MenuItem>
                {documentTypes.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label={t("phase")}
                value={filterPhase}
                onChange={(e) => {
                  setFilterPhase(e.target.value);
                  params.setPage(1);
                }}
                sx={filterSx}
              >
                <MenuItem value="">{t("allPhases")}</MenuItem>
                {phases.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                size="small"
                label={t("sendingEntity")}
                value={filterEntity}
                onChange={(e) => {
                  setFilterEntity(e.target.value);
                  params.setPage(1);
                }}
                sx={filterSx}
              >
                <MenuItem value="">{t("allEntities")}</MenuItem>
                {entities.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <TableLayout.TopActions
              state={state}
              customActions={
                <Button variant="outlined" color="primary" onClick={clearFilters}>
                  {t("clearFilters")}
                </Button>
              }
            />
          </Stack>
        }
        table={<TableLayout.Table state={state} loadingOptions={{ rows: 5 }} />}
        pagination={<TableLayout.Pagination state={state} />}
      />
    </Box>
  );
}
