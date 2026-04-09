"use client";

import { Box, Typography } from "@mui/material";
import { Check, Circle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApprovalStep } from "../types";

interface ApprovalTimelineProps {
  steps: ApprovalStep[];
}

export default function ApprovalTimeline({ steps }: ApprovalTimelineProps) {
  const t = useTranslations("project.documentCycle");

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        {t("approvalPath")}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {steps.map((step, index) => (
          <Box key={step.id} sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: 24,
              }}
            >
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor:
                    step.status === "completed"
                      ? "success.main"
                      : step.status === "current"
                        ? "primary.main"
                        : "grey.600",
                }}
              >
                {step.status === "completed" ? (
                  <Check className="w-3 h-3 text-white" />
                ) : (
                  <Circle className="w-3 h-3 text-white" />
                )}
              </Box>
              {index < steps.length - 1 && (
                <Box
                  sx={{
                    width: 2,
                    height: 32,
                    bgcolor:
                      step.status === "completed" ? "success.main" : "grey.600",
                  }}
                />
              )}
            </Box>
            <Box sx={{ pt: 0.25 }}>
              <Typography variant="body2" fontWeight={600}>
                {step.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {step.user} — {step.date}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
