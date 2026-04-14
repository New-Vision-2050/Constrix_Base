"use client";

import { Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import { DocumentStatus } from "../types";

type StatusStyle = {
  labelKey: string;
  muiColor: "default" | "warning" | "success" | "info" | "error";
};

const STATUS_CONFIG: Record<DocumentStatus, StatusStyle> = {
  draft: { labelKey: "draft", muiColor: "default" },
  pending: { labelKey: "pending", muiColor: "warning" },
  approved: { labelKey: "approved", muiColor: "success" },
  semi_approved: { labelKey: "partiallyApproved", muiColor: "info" },
  partially_approved: { labelKey: "partiallyApproved", muiColor: "info" },
  declined: { labelKey: "declined", muiColor: "error" },
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
      color={config.muiColor}
      sx={{
        minWidth: 80,
        py: 1.5,
        borderRadius: "16px",
        fontWeight: 500,
        borderWidth: 1,
        "& .MuiChip-label": {
          px: 2,
        },
      }}
    />
  );
}
