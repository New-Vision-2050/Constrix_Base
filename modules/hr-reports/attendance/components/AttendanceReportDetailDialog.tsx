"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useFormatter, useLocale, useTranslations } from "next-intl";
import { toast } from "@/modules/table/hooks/use-toast";
import { getErrorMessage } from "@/utils/errorHandler";
import { AttendanceReportsApi } from "@/services/api/hr-reports/attendance";
import { parseReportDetailResponse } from "../utils/normalize-report-list";
import type { CreatedAttendanceReport } from "../types";
import {
  buildWizardPayloadSummary,
  type WizardPayloadSummaryTranslators,
} from "./report-wizard/payload-summary";

export type AttendanceReportDetailDialogProps = {
  open: boolean;
  reportId: string | null;
  onClose: () => void;
};

export default function AttendanceReportDetailDialog({
  open,
  reportId,
  onClose,
}: AttendanceReportDetailDialogProps) {
  const t = useTranslations("HRReports.attendanceReport.table");
  const theme = useTheme();
  const locale = useLocale();
  const format = useFormatter();

  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const tRt = useTranslations(
    "HRReports.attendanceReport.wizard.reportTypes",
  );
  const tMonth = useTranslations("HRReports.attendanceReport.wizard.month");
  const tEmp = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData",
  );
  const tBranch = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.branches",
  );
  const tFilters = useTranslations(
    "HRReports.attendanceReport.wizard.filtersOptions",
  );
  const tReview = useTranslations(
    "HRReports.attendanceReport.wizard.reviewScreen",
  );

  const tr: WizardPayloadSummaryTranslators = useMemo(
    () => ({
      wizard: tWizard,
      reportTypes: tRt,
      month: tMonth,
      employeesData: tEmp,
      branches: tBranch,
      filtersOptions: tFilters,
      reviewScreen: tReview,
    }),
    [tWizard, tRt, tMonth, tEmp, tBranch, tFilters, tReview],
  );

  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<CreatedAttendanceReport | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!open || !reportId) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setDetail(null);
    AttendanceReportsApi.getById(reportId)
      .then((res) => res.data)
      .then((raw) => {
        if (cancelled) return;
        const parsed = parseReportDetailResponse(raw);
        if (!parsed) {
          toast({
            variant: "destructive",
            title: t("viewReportInvalidTitle"),
            description: t("viewReportInvalidDesc"),
          });
          setDetail(null);
          return;
        }
        setDetail(parsed);
      })
      .catch((err) => {
        if (cancelled) return;
        setDetail(null);
        toast({
          variant: "destructive",
          title: t("viewReportErrorTitle"),
          description:
            getErrorMessage(err) ?? t("viewReportErrorDesc"),
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, reportId, t]);

  const summary = useMemo(() => {
    if (!detail) return null;
    return buildWizardPayloadSummary(detail.payload, tr);
  }, [detail, tr]);

  const reportTitle = useMemo(() => {
    if (!detail || !summary) return "";
    const lang = (locale ?? "en").split("-")[0]?.toLowerCase() ?? "en";
    const preferAr = lang === "ar";
    const fromApi = preferAr
      ? detail.apiName?.ar ?? detail.apiName?.en
      : detail.apiName?.en ?? detail.apiName?.ar;
    if (typeof fromApi === "string" && fromApi.trim() !== "") {
      return fromApi.trim();
    }
    return summary.reportTypesLabel;
  }, [detail, summary, locale]);

  const createdDisplay = useMemo(() => {
    if (!detail) return "";
    return format.dateTime(new Date(detail.createdAt), {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }, [detail, format]);

  const handleDownload = async () => {
    if (!reportId) return;
    setDownloading(true);
    try {
      await AttendanceReportsApi.download(reportId);
    } catch (err) {
      toast({
        variant: "destructive",
        title: t("downloadReportErrorTitle"),
        description:
          getErrorMessage(err) ?? t("downloadReportErrorDesc"),
      });
    } finally {
      setDownloading(false);
    }
  };

  const row = (label: string, value: string) => (
    <Box sx={{ py: 0.75 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ pb: 1 }}>
        {t("viewReportTitle")}
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2, minHeight: 200 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              gap: 1.5,
            }}
          >
            <CircularProgress size={28} />
            <Typography variant="body2" color="text.secondary">
              {t("viewReportLoading")}
            </Typography>
          </Box>
        ) : detail && summary ? (
          <Box>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {reportTitle}
            </Typography>
            {row(t("colCreated"), createdDisplay)}
            {row(t("colPeriod"), summary.periodLabel)}
            {row(t("colBranch"), summary.branchLabel)}
            {row(t("colEmployeeStatus"), summary.employeeStatusLabel)}
            {row(t("colExport"), summary.exportLabel)}
            {row(t("colLanguage"), summary.languageLabel)}
            <Box sx={{ py: 0.75 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                {t("colEmail")}
              </Typography>
              <Chip
                size="small"
                label={summary.emailLabel}
                color={detail.payload.step5.autoEmail ? "success" : "default"}
                variant={theme.palette.mode === "dark" ? "outlined" : "filled"}
                sx={{ fontWeight: 600, mt: 0.5 }}
              />
            </Box>
            {row(t("colSorting"), summary.sortingLabel)}
          </Box>
        ) : !loading ? (
          <Typography variant="body2" color="text.secondary">
            {t("viewReportEmpty")}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: "wrap" }}>
        <Button onClick={onClose} color="inherit">
          {t("viewReportClose")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!reportId || downloading || loading || !detail}
          onClick={() => void handleDownload()}
          startIcon={
            downloading ? (
              <CircularProgress color="inherit" size={18} />
            ) : (
              <DownloadOutlinedIcon />
            )
          }
        >
          {downloading ? t("downloadReportLoading") : t("downloadReport")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
