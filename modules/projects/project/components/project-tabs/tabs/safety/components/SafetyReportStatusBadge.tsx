"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import type { SafetyReportStatus } from "../safety-report-types";

const STATUS_CONFIG: Record<
  SafetyReportStatus,
  {
    labelKey: "inProgress" | "completed" | "late";
    color: "warning" | "success" | "error";
  }
> = {
  in_progress: { labelKey: "inProgress", color: "warning" },
  completed: { labelKey: "completed", color: "success" },
  late: { labelKey: "late", color: "error" },
};

type SafetyReportStatusBadgeProps = {
  status: SafetyReportStatus;
  statusLabel?: string | null;
};

export default function SafetyReportStatusBadge({
  status,
  statusLabel,
}: SafetyReportStatusBadgeProps) {
  const t = useTranslations("project.safetyTab.reports.statuses");
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.in_progress;

  return (
    <Chip
      label={statusLabel?.trim() || t(config.labelKey)}
      size="small"
      color={config.color}
      sx={{
        minWidth: 96,
        borderRadius: "16px",
        fontWeight: 500,
        "& .MuiChip-label": { px: 1.5 },
      }}
    />
  );
}
