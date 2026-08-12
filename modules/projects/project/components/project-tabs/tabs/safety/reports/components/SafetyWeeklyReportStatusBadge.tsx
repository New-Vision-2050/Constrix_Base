"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import type { SafetyWeeklyReportStatus } from "../types";

const STATUS_CONFIG: Record<
  SafetyWeeklyReportStatus,
  {
    labelKey: "ready" | "processing" | "failed" | "pending";
    color: "success" | "warning" | "error" | "info";
  }
> = {
  ready: { labelKey: "ready", color: "success" },
  processing: { labelKey: "processing", color: "warning" },
  failed: { labelKey: "failed", color: "error" },
  pending: { labelKey: "pending", color: "info" },
};

type SafetyWeeklyReportStatusBadgeProps = {
  status: SafetyWeeklyReportStatus;
  statusLabel?: string | null;
};

export default function SafetyWeeklyReportStatusBadge({
  status,
  statusLabel,
}: SafetyWeeklyReportStatusBadgeProps) {
  const t = useTranslations("project.safetyTab.weeklyReports.statuses");
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

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
