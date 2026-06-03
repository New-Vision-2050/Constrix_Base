"use client";

import React, { useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import {
  attendanceDataTypeLabel,
  resolveWizardLocale,
} from "../attendance-data-type-labels";
import type { ReportWizardPayload } from "../types";
import { buildWizardPayloadSummary } from "../payload-summary";

export type WizardStepReviewProps = {
  payload: ReportWizardPayload;
  creatingReport: boolean;
  savingTemplate: boolean;
  onCreateReport: () => void | Promise<void>;
  onSaveTemplate?: () => void | Promise<void>;
};

export default function WizardStepReview({
  payload,
  creatingReport,
  savingTemplate,
  onCreateReport,
  onSaveTemplate,
}: WizardStepReviewProps) {
  const t = useTranslations("HRReports.attendanceReport.wizard");
  const tReview = useTranslations(
    "HRReports.attendanceReport.wizard.reviewScreen",
  );
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
  const locale = resolveWizardLocale(useLocale());
  const tAttendanceData = useTranslations(
    "HRReports.attendanceReport.wizard.attendanceData",
  );

  const summary = useMemo(
    () =>
      buildWizardPayloadSummary(payload, {
        wizard: t,
        reportTypes: tRt,
        month: tMonth,
        employeesData: tEmp,
        branches: tBranch,
        attendanceData: tAttendanceData,
        reviewScreen: tReview,
      }),
    [payload, t, tRt, tMonth, tEmp, tBranch, tAttendanceData, tReview],
  );

  const {
    periodLabel,
    reportTypesLabel,
    employeeStatusLabel,
    branchLabel,
    exportLabel,
    languageLabel,
    emailLabel,
    sortingLabel,
    displayModeLabel,
  } = summary;

  const attendanceTags = payload.step3.attendanceDataTypeIds;

  const busy = creatingReport || savingTemplate;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {tReview("summaryTitle")}
      </Typography>

      <Grid container spacing={2}>
        <SummaryCell label={tReview("labelReportTypes")} value={reportTypesLabel} />
        <SummaryCell label={tReview("labelPeriod")} value={periodLabel} />
        <SummaryCell
          label={tReview("labelEmployeeStatus")}
          value={employeeStatusLabel}
        />
        <SummaryCell label={tReview("labelBranches")} value={branchLabel} />
        <SummaryCell label={tReview("labelExport")} value={exportLabel} />
        <SummaryCell label={tReview("labelLanguage")} value={languageLabel} />
        <SummaryCell label={tReview("labelEmailEnabled")} value={emailLabel} />
        <SummaryCell label={tReview("labelSorting")} value={sortingLabel} />
        <SummaryCell
          label={tAttendanceData("sectionDisplayModeTitle")}
          value={displayModeLabel}
        />
      </Grid>

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {tReview("tagsAttendanceTitle")}
        </Typography>
        {!attendanceTags.length ? (
          <Typography variant="body2" color="text.secondary">
            {tReview("noneSelected")}
          </Typography>
        ) : (
          <Stack direction="row" flexWrap="wrap" useFlexGap gap={1}>
            {attendanceTags.map((id) => (
              <Chip
                key={id}
                size="small"
                variant="outlined"
                label={attendanceDataTypeLabel(id, locale)}
              />
            ))}
          </Stack>
        )}
      </Box>

      <Paper variant="outlined" sx={{ p: 2, bgcolor: "action.hover" }}>
        <Typography variant="body2" color="text.secondary">
          {tReview("footerHint")}
        </Typography>
      </Paper>

      <Stack spacing={1} sx={{ mt: 1 }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={busy}
          onClick={() => void onCreateReport()}
          startIcon={
            creatingReport ? (
              <CircularProgress size={18} color="inherit" />
            ) : undefined
          }
        >
          {creatingReport ? t("submitting") : tReview("btnCreateNow")}
        </Button>
        {onSaveTemplate ? (
          <Button
            variant="outlined"
            color="inherit"
            fullWidth
            disabled={busy}
            onClick={() => void onSaveTemplate()}
            startIcon={
              savingTemplate ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {savingTemplate ? t("savingTemplate") : tReview("btnSaveTemplate")}
          </Button>
        ) : null}
      </Stack>
    </Box>
  );
}

function SummaryCell({ label, value }: { label: string; value: string }) {
  return (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Grid>
  );
}
