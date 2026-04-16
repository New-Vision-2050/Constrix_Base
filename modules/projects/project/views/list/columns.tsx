import React from "react";
import { Box, Chip, LinearProgress, Typography } from "@mui/material";

export type ProjectColumnTranslator = (key: string) => string;

// Project row type interface
export interface ProjectRow {
  id: number | string;
  serial_number?: string;
  ref_number?: string;
  name: string;
  client_name?: string;
  manager_name?: string;
  management_name?: string;
  branch_name?: string;
  project_type_name?: string;
  sub_project_type?: string;
  sub_project_type_name?: string;
  sub_sub_project_type_name?: string;
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  specializations?: string;
  project_owner_name?: string;
  responsible_employee?: {
    id?: number;
    name?: string;
  };
  responsible_employee_name?: string;
  completion_percentage?: number;
  delay_percentage?: number;
  status?: number;
  project_view?: string;
}

/** Status chip colors + translation keys (use with `useTranslations("project")`). */
export const PROJECT_STATUS_MAP: Record<
  number,
  { labelKey: string; bg: string }
> = {
  1: { labelKey: "statusOngoing", bg: "success.main" },
  0: { labelKey: "statusInProgress", bg: "warning.main" },
  [-1]: { labelKey: "statusStopped", bg: "error.main" },
  2: { labelKey: "statusCompleted", bg: "info.main" },
};

function StatusChip({
  status,
  t,
}: {
  status?: number;
  t: ProjectColumnTranslator;
}) {
  const cfg = status !== undefined ? PROJECT_STATUS_MAP[status] : undefined;
  if (!cfg) return <span>{t("emptyCell")}</span>;
  return (
    <Chip
      label={t(cfg.labelKey)}
      size="small"
      sx={{
        backgroundColor: cfg.bg,
        color: "common.white",
        fontWeight: "bold",
        fontSize: "0.72rem",
      }}
    />
  );
}

function ProgressBar({ value, color }: { value?: number; color: string }) {
  const v = value ?? 0;
  return (
    <Box sx={{ minWidth: 70 }}>
      <Typography variant="caption">{v}%</Typography>
      <LinearProgress
        variant="determinate"
        value={Math.min(v, 100)}
        sx={{
          height: 5,
          borderRadius: 3,
          bgcolor: "action.hover",
          "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
        }}
      />
    </Box>
  );
}

export const getProjectsColumns = (t: ProjectColumnTranslator) => [
  {
    key: "serial_number",
    name: t("columnRefNumber"),
    sortable: false,
    render: (row: ProjectRow) => {
      return (
        <span>
          {row.serial_number ??
            row.ref_number ??
            row.id ??
            t("emptyCell")}
        </span>
      );
    },
  },
  {
    key: "name",
    name: t("projectName"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span className="font-medium">{row.name}</span>
    ),
  },
  {
    key: "client",
    name: t("columnClientName"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.project_owner_name ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "project_type_name",
    name: t("projectType"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.project_type_name ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "sub_project_type",
    name: t("projectClassification"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>
        {row.sub_project_type_name ?? row.sub_project_type ?? t("emptyCell")}
      </span>
    ),
  },
  {
    key: "sub_sub_project_type_name",
    name: t("columnSubSubClassification"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.sub_sub_project_type_name ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "branch_name",
    name: t("columnBranchAffiliated"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.branch_name ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "management",
    name: t("management"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.management_name ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "responsible_employee",
    name: t("columnResponsibleEngineer"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.responsible_employee_name ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "project_manager",
    name: t("projectManager"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.manager_name ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "contract_number",
    name: t("columnContractNumber"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.contract_number ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "start_date",
    name: t("columnProjectStart"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.start_date ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "end_date",
    name: t("columnProjectEnd"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.end_date ?? t("emptyCell")}</span>
    ),
  },
  {
    key: "forward_time",
    name: t("columnTimeProgress"),
    sortable: false,
    render: (row: ProjectRow) => (
      <ProgressBar value={row.completion_percentage} color="success.main" />
    ),
  },
  {
    key: "completion_percentage",
    name: t("columnAchievement"),
    sortable: false,
    render: (row: ProjectRow) => (
      <ProgressBar value={row.completion_percentage} color="warning.main" />
    ),
  },
  {
    key: "status",
    name: t("projectStatus"),
    sortable: false,
    render: (row: ProjectRow) => <StatusChip status={row.status} t={t} />,
  },
  {
    key: "project_view",
    name: t("columnProjectView"),
    sortable: false,
    render: (row: ProjectRow) => (
      <span className="text-sm">{row.project_view ?? t("emptyCell")}</span>
    ),
  },
];
