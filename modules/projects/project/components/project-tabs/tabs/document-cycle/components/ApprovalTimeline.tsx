"use client";

import { Box, Typography } from "@mui/material";
import { Check, Circle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApprovalStep, ApprovalStepStatus } from "../types";

interface ApprovalTimelineProps {
  steps: ApprovalStep[];
}

function normalizeApprovalAction(action: string): string {
  return action.trim().toLowerCase().replace(/-/g, "_");
}

function approvalActionLabel(
  action: string,
  t: (key: string) => string,
): string {
  switch (normalizeApprovalAction(action)) {
    case "request_created":
      return t("historyActionRequestCreated");
    case "workflow_step_pending":
      return t("historyActionWorkflowStepPending");
    case "workflow_step_approved":
      return t("historyActionWorkflowStepApproved");
    case "request_approved":
      return t("historyActionRequestApproved");
    default:
      return action.trim() || "—";
  }
}

const STEP_STATUS_COLOR: Record<ApprovalStepStatus, string> = {
  created: "primary.main",
  pending: "warning.main",
  approved: "success.main",
};

function stepUserLabel(step: ApprovalStep): string {
  const names = step.user?.map((u) => u.name).filter(Boolean) ?? [];
  return names.length > 0 ? names.join(", ") : "—";
}

/** e.g. "10-10-2010 12:30am" */
function formatStepDate(value: string): string {
  if (!value?.trim()) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const period = d.getHours() >= 12 ? "pm" : "am";
  const hours = d.getHours() % 12 || 12;
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}-${month}-${year} ${hours}:${minutes}${period}`;
}

export default function ApprovalTimeline({ steps }: ApprovalTimelineProps) {
  const t = useTranslations("project.documentCycle");

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
        {t("approvalPath")}
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {steps.map((step, index) => {
          const color = STEP_STATUS_COLOR[step.status] ?? "grey.600";
          return (
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
                    bgcolor: color,
                  }}
                >
                  {step.status === "approved" ? (
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
                        step.status === "approved" ? "success.main" : "grey.600",
                    }}
                  />
                )}
              </Box>
              <Box sx={{ pt: 0.25 }}>
                <Typography variant="body2" fontWeight={600}>
                  {approvalActionLabel(step.action, t)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stepUserLabel(step)} — {formatStepDate(step.date)}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
