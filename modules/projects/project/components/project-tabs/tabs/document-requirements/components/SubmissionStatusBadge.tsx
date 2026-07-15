"use client";

import { Box, Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import type { DocumentRequirementSubmissionStatus } from "../types";

type StatusStyle = {
  labelKey:
    | "underReview"
    | "inProgress"
    | "awaitingAcceptance"
    | "rejected"
    | "accepted"
    | "certified";
  color: string;
  bg: string;
};

const STATUS_CONFIG: Record<DocumentRequirementSubmissionStatus, StatusStyle> =
  {
    under_review: {
      labelKey: "underReview",
      color: "#F59E0B",
      bg: "rgba(245, 158, 11, 0.15)",
    },
    in_progress: {
      labelKey: "inProgress",
      color: "#22C55E",
      bg: "rgba(34, 197, 94, 0.15)",
    },
    awaiting_acceptance: {
      labelKey: "awaitingAcceptance",
      color: "#EAB308",
      bg: "rgba(234, 179, 8, 0.15)",
    },
    rejected: {
      labelKey: "rejected",
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.15)",
    },
    accepted: {
      labelKey: "accepted",
      color: "#22C55E",
      bg: "rgba(34, 197, 94, 0.15)",
    },
    certified: {
      labelKey: "certified",
      color: "#3B82F6",
      bg: "rgba(59, 130, 246, 0.15)",
    },
  };

interface SubmissionStatusBadgeProps {
  status: DocumentRequirementSubmissionStatus;
}

export default function SubmissionStatusBadge({
  status,
}: SubmissionStatusBadgeProps) {
  const t = useTranslations("project.documentRequirements.statuses");
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.under_review;

  return (
    <Chip
      size="small"
      label={
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
          <Box
            component="span"
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: config.color,
              flexShrink: 0,
              boxShadow: `0 0 8px ${config.color}`,
            }}
          />
          {t(config.labelKey)}
        </Box>
      }
      sx={{
        bgcolor: config.bg,
        color: config.color,
        fontWeight: 600,
        borderRadius: "20px",
        border: "none",
        position: "relative",
        overflow: "visible",
        pl: 0.25,
        "&::before": {
          content: '""',
          position: "absolute",
          insetInlineStart: 0,
          top: "15%",
          bottom: "15%",
          width: "3px",
          borderStartStartRadius: "4px",
          borderEndStartRadius: "4px",
          borderStartEndRadius: 0,
          borderEndEndRadius: 0,
          bgcolor: config.color,
        },
        "& .MuiChip-label": { px: 1.5, py: 0.35 },
      }}
    />
  );
}
