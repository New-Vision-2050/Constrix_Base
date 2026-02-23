import React from "react";
import { Box, Chip, LinearProgress, Typography } from "@mui/material";

// Project row type interface
export interface ProjectRow {
  id: number;
  ref_number?: string;
  name: string;
  client?: { id: number; name: string };
  responsible_employee?: { id: number; name: string };
  management?: { id: number; name: string };
  cost_center_branch?: { id: number; name: string };
  project_type?: { id: number; name: string };
  sub_project_type?: { id: number; name: string };
  contract_number?: string;
  start_date?: string;
  end_date?: string;
  specializations?: string;
  project_manager?: { id: number; name: string };
  completion_percentage?: number;
  delay_percentage?: number;
  status?: number;
  project_view?: string;
}

export const STATUS_MAP: Record<number, { label: string; bg: string }> = {
  1: { label: "جاري", bg: "#16a34a" },
  0: { label: "قيد التنفيذ", bg: "#d97706" },
  [-1]: { label: "متوقف", bg: "#b91c1c" },
  2: { label: "مكتمل", bg: "#2563eb" },
};

function StatusChip({ status }: { status?: number }) {
  const cfg = status !== undefined ? STATUS_MAP[status] : undefined;
  if (!cfg) return <span>—</span>;
  return (
    <Chip
      label={cfg.label}
      size="small"
      sx={{
        backgroundColor: cfg.bg,
        color: "#fff",
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
          bgcolor: "rgba(255,255,255,0.1)",
          "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
        }}
      />
    </Box>
  );
}

export const getProjectsColumns = () => [
  {
    key: "ref_number",
    name: "الرقم المرجعي",
    sortable: false,
    render: (row: ProjectRow) => <span>{row.ref_number ?? "--"}</span>,
  },
  {
    key: "name",
    name: "اسم المشروع",
    sortable: false,
    render: (row: ProjectRow) => (
      <span className="font-medium">{row.name}</span>
    ),
  },
  {
    key: "client",
    name: "اسم العميل",
    sortable: false,
    render: (row: ProjectRow) => <span>{row.client?.name ?? "—"}</span>,
  },
  {
    key: "responsible_employee",
    name: "المهندس المسؤول",
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.responsible_employee?.name ?? "—"}</span>
    ),
  },
  {
    key: "management",
    name: "الادارة",
    sortable: false,
    render: (row: ProjectRow) => <span>{row.management?.name ?? "—"}</span>,
  },
  {
    key: "cost_center_branch",
    name: "الفرع التابع له",
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.cost_center_branch?.name ?? "—"}</span>
    ),
  },
  {
    key: "project_type",
    name: "تصنيف المشروع",
    sortable: false,
    render: (row: ProjectRow) => <span>{row.project_type?.name ?? "—"}</span>,
  },
  {
    key: "sub_project_type",
    name: "نوع المشروع",
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.sub_project_type?.name ?? "—"}</span>
    ),
  },
  {
    key: "contract_number",
    name: "رقم العقد",
    sortable: false,
    render: (row: ProjectRow) => <span>{row.contract_number ?? "—"}</span>,
  },
  {
    key: "start_date",
    name: "بداية المشروع",
    sortable: false,
    render: (row: ProjectRow) => <span>{row.start_date ?? "—"}</span>,
  },
  {
    key: "end_date",
    name: "نهاية المشروع",
    sortable: false,
    render: (row: ProjectRow) => <span>{row.end_date ?? "—"}</span>,
  },
  {
    key: "specializations",
    name: "تخصصات المشروع",
    sortable: false,
    render: (row: ProjectRow) => <span>{row.specializations ?? "—"}</span>,
  },
  {
    key: "project_manager",
    name: "مدير المشروع",
    sortable: false,
    render: (row: ProjectRow) => (
      <span>{row.project_manager?.name ?? "—"}</span>
    ),
  },
  {
    key: "completion_percentage",
    name: "نسبة الانجاز",
    sortable: false,
    render: (row: ProjectRow) => (
      <ProgressBar value={row.completion_percentage} color="#16a34a" />
    ),
  },
  {
    key: "delay_percentage",
    name: "نسبة التأخير",
    sortable: false,
    render: (row: ProjectRow) => (
      <ProgressBar value={row.delay_percentage} color="#d97706" />
    ),
  },
  {
    key: "status",
    name: "حالة المشروع",
    sortable: false,
    render: (row: ProjectRow) => <StatusChip status={row.status} />,
  },
  {
    key: "project_view",
    name: "عرض المشروع",
    sortable: false,
    render: (row: ProjectRow) => (
      <span className="text-sm">{row.project_view ?? "—"}</span>
    ),
  },
];
