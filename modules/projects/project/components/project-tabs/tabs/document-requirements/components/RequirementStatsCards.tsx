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
  {
    icon: typeof AlertTriangle;
    color: string;
    gradient: string;
    glow: string;
  }
> = {
  awaitingAcceptance: {
    icon: AlertTriangle,
    color: "#B45309",
    gradient: "linear-gradient(135deg, rgba(180,83,9,0.28) 0%, rgba(180,83,9,0.06) 100%)",
    glow: "rgba(180, 83, 9, 0.35)",
  },
  rejected: {
    icon: XCircle,
    color: "#A855F7",
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.28) 0%, rgba(168,85,247,0.06) 100%)",
    glow: "rgba(168, 85, 247, 0.35)",
  },
  accepted: {
    icon: CheckCircle2,
    color: "#16A34A",
    gradient: "linear-gradient(135deg, rgba(22,163,74,0.28) 0%, rgba(22,163,74,0.06) 100%)",
    glow: "rgba(22, 163, 74, 0.35)",
  },
  inProgress: {
    icon: ClipboardList,
    color: "#BE123C",
    gradient: "linear-gradient(135deg, rgba(190,18,60,0.28) 0%, rgba(190,18,60,0.06) 100%)",
    glow: "rgba(190, 18, 60, 0.35)",
  },
  certified: {
    icon: Users,
    color: "#2563EB",
    gradient: "linear-gradient(135deg, rgba(37,99,235,0.28) 0%, rgba(37,99,235,0.06) 100%)",
    glow: "rgba(37, 99, 235, 0.35)",
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
        gap: 2.5,
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
              p: 2.5,
              borderRadius: "16px",
              bgcolor: "background.paper",
              backgroundImage: visual.gradient,
              border: "1px solid",
              borderColor: `${visual.color}33`,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              minHeight: 120,
              position: "relative",
              overflow: "hidden",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: `0 8px 24px ${visual.glow}`,
                borderColor: `${visual.color}66`,
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                right: 0,
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: `${visual.color}14`,
                transform: "translate(30%, -30%)",
                filter: "blur(20px)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1,
                position: "relative",
                zIndex: 1,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: "12px",
                  bgcolor: `${visual.color}1A`,
                  color: visual.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: `0 4px 12px ${visual.glow}`,
                }}
              >
                <Icon size={20} />
              </Box>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    lineHeight: 1.1,
                  }}
                >
                  {stat.count}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 500,
                    display: "block",
                    mt: 0.25,
                  }}
                >
                  {t("percentOfTotal", { percent: String(stat.percent) })}
                </Typography>
              </Box>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                lineHeight: 1.3,
                position: "relative",
                zIndex: 1,
              }}
            >
              {t(`stats.${stat.key}`)}
            </Typography>
          </Paper>
        );
      })}
    </Box>
  );
}
