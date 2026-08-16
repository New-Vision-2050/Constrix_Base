"use client";

import { useCallback, useRef, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfOutlinedIcon from "@mui/icons-material/PictureAsPdfOutlined";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ProjectSafetyApi } from "@/services/api/projects/project-safety";
import type { SafetyVisitRow } from "../types";

type ReportType = "makkah" | "jeddah";

type SafetyViolationFormReportDialogProps = {
  open: boolean;
  onClose: () => void;
  projectId: string | number;
  row: SafetyVisitRow | null;
};

type ReportOptionCardProps = {
  label: string;
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
  accent?: "primary" | "secondary";
};

function ReportOptionCard({
  label,
  isLoading,
  disabled,
  onClick,
  accent = "primary",
}: ReportOptionCardProps) {
  const isPrimary = accent === "primary";

  return (
    <Paper
      component="button"
      type="button"
      onClick={onClick}
      disabled={disabled}
      elevation={0}
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        width: "100%",
        p: 2.5,
        border: 2,
        borderColor: isPrimary ? "primary.main" : "divider",
        borderRadius: 2,
        bgcolor: isPrimary
          ? alpha(theme.palette.primary.main, 0.06)
          : "background.paper",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled && !isLoading ? 0.6 : 1,
        transition: "border-color 0.2s, background-color 0.2s, box-shadow 0.2s",
        "&:hover:not(:disabled)": {
          borderColor: "primary.main",
          bgcolor: isPrimary
            ? alpha(theme.palette.primary.main, 0.12)
            : "action.hover",
          boxShadow: 2,
        },
        "&:focus-visible": {
          outline: 2,
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      })}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: 2,
          bgcolor: isPrimary ? "primary.main" : "action.selected",
          color: isPrimary ? "primary.contrastText" : "primary.main",
        }}
      >
        {isLoading ? (
          <CircularProgress size={28} color="inherit" />
        ) : (
          <PictureAsPdfOutlinedIcon sx={{ fontSize: 32 }} />
        )}
      </Box>
      <Typography
        variant="body2"
        fontWeight={600}
        textAlign="center"
        color="text.primary"
        sx={{ lineHeight: 1.4 }}
      >
        {label}
      </Typography>
    </Paper>
  );
}

function triggerBlobDownload(
  response: Awaited<ReturnType<typeof ProjectSafetyApi.getViolationReport>>,
  fallbackFileName: string,
) {
  const blob = new Blob([response.data as unknown as BlobPart], {
    type: response.headers["content-type"] ?? "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const disposition = response.headers["content-disposition"] ?? "";
  const fileNameMatch = disposition.match(/filename[^;=\n]*=(['"]?)([^'"\n]+)\1/);
  const fileName = fileNameMatch?.[2]?.trim() || fallbackFileName;
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function SafetyViolationFormReportDialog({
  open,
  onClose,
  projectId,
  row,
}: SafetyViolationFormReportDialogProps) {
  const t = useTranslations("project.safetyTab.visits.reportDownloadDialog");
  const downloadingRef = useRef<ReportType | null>(null);
  const [downloadingType, setDownloadingType] = useState<ReportType | null>(
    null,
  );

  const handleDownload = useCallback(
    async (type: ReportType) => {
      if (!row || downloadingRef.current) return;

      downloadingRef.current = type;
      setDownloadingType(type);

      try {
        const response =
          type === "makkah"
            ? await ProjectSafetyApi.getViolationReport(projectId, row.id)
            : await ProjectSafetyApi.getViolationFormReport(projectId, row.id);

        const fallbackFileName =
          type === "makkah"
            ? `violation-report-${row.id}.pdf`
            : `violation-form-report-${row.id}.pdf`;

        triggerBlobDownload(response, fallbackFileName);
        onClose();
      } catch {
        toast.error(t("downloadReportError"));
      } finally {
        downloadingRef.current = null;
        setDownloadingType(null);
      }
    },
    [onClose, projectId, row, t],
  );

  const isBusy = downloadingType !== null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          pb: 1,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="h6" fontWeight={700}>
            {t("title")}
          </Typography>
          {row ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {row.workOrderNumber}
            </Typography>
          ) : null}
        </Box>
        <IconButton
          onClick={onClose}
          aria-label={t("cancel")}
          disabled={isBusy}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 3 }}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <ReportOptionCard
              label={t("downloadMakkahReport")}
              isLoading={downloadingType === "makkah"}
              disabled={isBusy}
              onClick={() => handleDownload("makkah")}
              accent="primary"
            />
          </Grid>
          <Grid size={6}>
            <ReportOptionCard
              label={t("downloadJeddahReport")}
              isLoading={downloadingType === "jeddah"}
              disabled={isBusy}
              onClick={() => handleDownload("jeddah")}
              accent="secondary"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          variant="text"
          color="inherit"
          onClick={onClose}
          disabled={isBusy}
        >
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
