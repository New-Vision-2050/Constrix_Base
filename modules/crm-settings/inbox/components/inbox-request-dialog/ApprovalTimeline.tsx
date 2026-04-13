"use client";

import type { ReactNode } from "react";
import { Box, Chip, Typography } from "@mui/material";
import { Check } from "lucide-react";
import type { InboxApprovalTimelineEntry, InboxApprovalTimelinePalette } from "./types";

const PALETTE_SX: Record<
  InboxApprovalTimelinePalette,
  | "primary.main"
  | "success.main"
  | "error.main"
  | "warning.main"
  | "grey.500"
> = {
  primary: "primary.main",
  success: "success.main",
  error: "error.main",
  warning: "warning.main",
  default: "grey.500",
};

const CHIP_COLOR: Record<
  InboxApprovalTimelinePalette,
  "primary" | "success" | "error" | "warning" | "default"
> = {
  primary: "primary",
  success: "success",
  error: "error",
  warning: "warning",
  default: "default",
};

export type ApprovalTimelineProps = {
  entries: InboxApprovalTimelineEntry[];
  /** When empty, renders an em dash line (optional override via `empty`). */
  empty?: ReactNode;
};

/**
 * Vertical approval timeline (circles, connector, title, outlined chip, user line).
 * Pass pre-built `entries`; use domain-specific builders (e.g. client-request) to produce them.
 */
export function ApprovalTimeline({ entries, empty }: ApprovalTimelineProps) {
  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {empty ?? "—"}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {entries.map((entry, index) => {
        const bg = PALETTE_SX[entry.palette];
        return (
          <Box
            key={entry.id}
            sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  bgcolor: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "common.white",
                }}
              >
                <Check className="w-4 h-4" strokeWidth={2.5} />
              </Box>
              {index < entries.length - 1 ? (
                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    minHeight: 28,
                    bgcolor: "divider",
                    my: 0.5,
                  }}
                />
              ) : null}
            </Box>
            <Box
              sx={{
                pb: index < entries.length - 1 ? 1.5 : 0,
                minWidth: 0,
                flex: 1,
                textAlign: "start",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.primary"
              >
                {entry.title}
              </Typography>
              <Chip
                size="small"
                label={entry.chipLabel}
                color={CHIP_COLOR[entry.palette]}
                variant="outlined"
                sx={{ mt: 0.75, fontWeight: 600 }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
                sx={{ mt: 0.75 }}
              >
                {entry.userLine?.trim() ? entry.userLine : "—"}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
