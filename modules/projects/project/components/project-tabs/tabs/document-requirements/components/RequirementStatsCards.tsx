"use client";

import { Box, Paper, Typography } from "@mui/material";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Users,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type {
  DocumentRequirementStat,
  DocumentRequirementStatKey,
} from "../types";

const STAT_VISUAL: Record<
  DocumentRequirementStatKey,
  { icon: typeof AlertTriangle; color: string; bg: string }
> = {
  awaitingAcceptance: {
    icon: AlertTriangle,
    color: "#EAB308",
    bg: "rgba(234, 179, 8, 0.18)",
  },
  rejected: {
    icon: XCircle,
    color: "#EF4444",
    bg: "rgba(239, 68, 68, 0.18)",
  },
  accepted: {
    icon: CheckCircle2,
    color: "#22C55E",
    bg: "rgba(34, 197, 94, 0.18)",
  },
  inProgress: {
    icon: ClipboardList,
    color: "#F97316",
    bg: "rgba(249, 115, 22, 0.18)",
  },
  certified: {
    icon: Users,
    color: "#3B82F6",
    bg: "rgba(59, 130, 246, 0.18)",
  },
};

interface RequirementStatsCardsProps {
  stats: DocumentRequirementStat[];
}

export default function RequirementStatsCards({
  stats,
}: RequirementStatsCardsProps) {
  const t = useTranslations("project.documentRequirements");

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {stats.map((stat) => {
        const visual = STAT_VISUAL[stat.key];
        const Icon = visual.icon;
        return (
          <Paper
            key={stat.key}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "12px",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              minHeight: 110,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontWeight: 500, lineHeight: 1.3 }}
              >
                {t(`stats.${stat.key}`)}
              </Typography>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  bgcolor: visual.bg,
                  color: visual.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={16} />
              </Box>
            </Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.1 }}
            >
              {stat.count}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t("percentOfTotal", { percent: String(stat.percent) })}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
}
