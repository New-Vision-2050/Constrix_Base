"use client";

import { Box, Chip, Tooltip, Typography } from "@mui/material";
import { File as FileIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { RequirementLatestSubmissionPreview } from "../types";

function formatSubmittedAt(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function truncateFileName(name: string, max = 22) {
  if (name.length <= max) return name;
  const extIndex = name.lastIndexOf(".");
  if (extIndex > 0 && name.length - extIndex <= 6) {
    const ext = name.slice(extIndex);
    const base = name.slice(0, Math.max(0, max - ext.length - 1));
    return `${base}…${ext}`;
  }
  return `${name.slice(0, max - 1)}…`;
}

interface LatestSubmissionPreviewProps {
  submission: RequirementLatestSubmissionPreview | null;
  nextAvailableAt?: string;
  canUpload: boolean;
}

export default function LatestSubmissionPreview({
  submission,
  nextAvailableAt,
  canUpload,
}: LatestSubmissionPreviewProps) {
  const t = useTranslations("project.documentRequirements");
  const files = submission?.files ?? [];
  const visibleFiles = files.slice(0, 2);
  const remaining = Math.max(0, files.length - visibleFiles.length);
  const submittedAt = formatSubmittedAt(submission?.submittedAt);
  const availableAgain = !canUpload
    ? formatSubmittedAt(nextAvailableAt)
    : null;

  if (!files.length && !availableAgain) return null;

  return (
    <Box
      sx={{
        mt: 0.75,
        p: 1,
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(255,255,255,0.03)"
            : "rgba(0,0,0,0.02)",
        maxWidth: 260,
      }}
    >
      {files.length > 0 ? (
        <>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontWeight: 600, display: "block", mb: 0.75 }}
          >
            {t("upload.latestFiles")}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {visibleFiles.map((file) => (
              <Tooltip key={file.id} title={file.name}>
                <Chip
                  size="small"
                  icon={<FileIcon size={12} />}
                  label={truncateFileName(file.name)}
                  component={file.url ? "a" : "div"}
                  href={file.url || undefined}
                  target={file.url ? "_blank" : undefined}
                  rel={file.url ? "noopener noreferrer" : undefined}
                  clickable={Boolean(file.url)}
                  sx={{
                    maxWidth: 150,
                    height: 24,
                    "& .MuiChip-label": {
                      px: 0.75,
                      fontSize: "0.7rem",
                    },
                    "& .MuiChip-icon": {
                      ml: 0.75,
                      mr: -0.25,
                    },
                  }}
                />
              </Tooltip>
            ))}
            {remaining > 0 ? (
              <Chip
                size="small"
                label={`+${remaining}`}
                sx={{ height: 24, fontSize: "0.7rem" }}
              />
            ) : null}
          </Box>
          {submittedAt ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.75 }}
            >
              {submittedAt}
            </Typography>
          ) : null}
        </>
      ) : null}

      {availableAgain ? (
        <Typography
          variant="caption"
          color="warning.main"
          sx={{ display: "block", mt: files.length ? 0.75 : 0 }}
        >
          {t("upload.availableAgainAt", { date: availableAgain })}
        </Typography>
      ) : null}
    </Box>
  );
}
