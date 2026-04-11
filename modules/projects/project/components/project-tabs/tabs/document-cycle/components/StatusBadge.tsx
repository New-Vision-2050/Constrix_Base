"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import { DocumentStatus } from "../types";

const STATUS_CONFIG: Record<
  DocumentStatus,
  { labelKey: string; color: string; borderColor: string; bgColor: string }
> = {
  draft: {
    labelKey: "draft",
    color: "#9CA3AF", // Gray
    borderColor: "rgba(156, 163, 175, 0.3)",
    bgColor: "rgba(156, 163, 175, 0.1)",
  },
  pending: {
    labelKey: "pending",
    color: "#F59E0B", // Yellow/Warning
    borderColor: "rgba(245, 158, 11, 0.3)",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  approved: {
    labelKey: "approved",
    color: "#10B981", // Green/Success
    borderColor: "rgba(16, 185, 129, 0.3)",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  semi_approved: {
    labelKey: "partiallyApproved",
    color: "#3B82F6", // Blue/Info
    borderColor: "rgba(59, 130, 246, 0.3)",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  partially_approved: {
    labelKey: "partiallyApproved",
    color: "#3B82F6", // Blue/Info
    borderColor: "rgba(59, 130, 246, 0.3)",
    bgColor: "rgba(59, 130, 246, 0.1)",
  },
  declined: {
    labelKey: "declined",
    color: "#EF4444", // Red/Danger
    borderColor: "rgba(239, 68, 68, 0.3)",
    bgColor: "rgba(239, 68, 68, 0.1)",
  },
};

interface StatusBadgeProps {
  status: DocumentStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("project.documentCycle");
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;

  return (
    <Chip
      label={t(config.labelKey)}
      size="small"
      variant="outlined"
      sx={{
        minWidth: 80,
        py: 1.5,
        borderRadius: "16px",
        fontWeight: 500,
        borderWidth: 1,
        color: config.color,
        borderColor: config.borderColor,
        backgroundColor: config.bgColor,
        "& .MuiChip-label": {
          px: 2,
        },
      }}
    />
  );
}
