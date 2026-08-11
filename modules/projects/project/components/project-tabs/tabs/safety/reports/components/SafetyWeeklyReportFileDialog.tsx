"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { OpenInNew } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import type { SafetyWeeklyReportRow } from "../types";

type SafetyWeeklyReportFileDialogProps = {
  open: boolean;
  report: SafetyWeeklyReportRow | null;
  onClose: () => void;
};

function isPdfUrl(url: string): boolean {
  const normalized = url.split("?")[0]?.toLowerCase() ?? "";
  return normalized.endsWith(".pdf");
}

function isOfficeDocUrl(url: string): boolean {
  const normalized = url.split("?")[0]?.toLowerCase() ?? "";
  return (
    normalized.endsWith(".doc") ||
    normalized.endsWith(".docx") ||
    normalized.endsWith(".xls") ||
    normalized.endsWith(".xlsx") ||
    normalized.endsWith(".ppt") ||
    normalized.endsWith(".pptx")
  );
}

export default function SafetyWeeklyReportFileDialog({
  open,
  report,
  onClose,
}: SafetyWeeklyReportFileDialogProps) {
  const t = useTranslations("project.safetyTab.weeklyReports.fileDialog");
  const fileUrl = report?.downloadUrl ?? "";
  const canPreviewPdf = Boolean(fileUrl && isPdfUrl(fileUrl));
  const canPreviewOffice = Boolean(fileUrl && isOfficeDocUrl(fileUrl));
  const officeViewerUrl = canPreviewOffice
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`
    : "";

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{report?.name || t("title")}</DialogTitle>
      <DialogContent dividers>
        {!fileUrl ? (
          <Typography color="text.secondary">{t("unavailable")}</Typography>
        ) : canPreviewPdf ? (
          <Box
            component="iframe"
            src={fileUrl}
            title={report?.name || t("title")}
            sx={{
              width: "100%",
              height: { xs: 420, md: 640 },
              border: 0,
              borderRadius: 1,
              bgcolor: "grey.100",
            }}
          />
        ) : canPreviewOffice ? (
          <Box
            component="iframe"
            src={officeViewerUrl}
            title={report?.name || t("title")}
            sx={{
              width: "100%",
              height: { xs: 420, md: 640 },
              border: 0,
              borderRadius: 1,
              bgcolor: "grey.100",
            }}
          />
        ) : (
          <Typography color="text.secondary">{t("previewUnsupported")}</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {fileUrl ? (
          <Button
            component="a"
            variant="outlined"
            startIcon={<OpenInNew />}
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("openInNewTab")}
          </Button>
        ) : null}
        <Button variant="contained" onClick={onClose}>
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
