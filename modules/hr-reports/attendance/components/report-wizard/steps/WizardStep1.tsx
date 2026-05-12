"use client";

import React from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { ReportWizardStep1 } from "../types";
import {
  REPORT_TYPE_OPTIONS,
  STEP1_ATTENDANCE_WIZARD_REPORT_TYPE_IDS,
} from "../constants-step1";
import { ensureOrderedRange } from "../step1-date-range";
import { useTranslations } from "next-intl";

type Props = {
  value: ReportWizardStep1;
  onChange: (patch: Partial<ReportWizardStep1>) => void;
};

function yearMonthFromIso(iso: string): Pick<ReportWizardStep1, "year" | "month"> {
  return {
    year: Number(iso.slice(0, 4)),
    month: Number(iso.slice(5, 7)),
  };
}

export default function WizardStep1({ value, onChange }: Props) {
  const t = useTranslations("HRReports.attendanceReport.wizard");
  const tRt = useTranslations("HRReports.attendanceReport.wizard.reportTypes");

  React.useEffect(() => {
    const ids = value.reportTypeIds;
    const fixed = STEP1_ATTENDANCE_WIZARD_REPORT_TYPE_IDS;
    const onlyAttendance =
      ids.length === fixed.length && ids.every((id, i) => id === fixed[i]);
    if (!onlyAttendance) {
      onChange({ reportTypeIds: [...fixed] });
    }
  }, [value.reportTypeIds, onChange]);

  const colA = REPORT_TYPE_OPTIONS.filter((o) => o.column === "a");
  const colB = REPORT_TYPE_OPTIONS.filter((o) => o.column === "b");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {t("stepSectionHeading", {
            step: 1,
            title: t("sectionReportType"),
          })}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <StackedTypes
              options={colA}
              selected={value.reportTypeIds}
              tRt={tRt}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StackedTypes
              options={colB}
              selected={value.reportTypeIds}
              tRt={tRt}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider flexItem />

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {t("stepSectionHeading", {
            step: 2,
            title: t("sectionPeriod"),
          })}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t("periodDateFrom")}
              type="date"
              size="small"
              fullWidth
              value={value.dateFrom}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                const { dateFrom, dateTo } = ensureOrderedRange(
                  v,
                  value.dateTo,
                );
                onChange({
                  periodType: "range",
                  dateFrom,
                  dateTo,
                  ...yearMonthFromIso(dateFrom),
                });
              }}
              slotProps={{
                htmlInput: { max: value.dateTo },
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label={t("periodDateTo")}
              type="date"
              size="small"
              fullWidth
              value={value.dateTo}
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                const { dateFrom, dateTo } = ensureOrderedRange(
                  value.dateFrom,
                  v,
                );
                onChange({
                  periodType: "range",
                  dateFrom,
                  dateTo,
                  ...yearMonthFromIso(dateFrom),
                });
              }}
              slotProps={{
                htmlInput: { min: value.dateFrom },
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider flexItem />

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {t("stepSectionHeading", {
            step: 3,
            title: t("sectionOutput"),
          })}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("exportFormat")}</InputLabel>
              <Select
                label={t("exportFormat")}
                value={value.exportFormat}
                onChange={(e) =>
                  onChange({
                    exportFormat: e.target
                      .value as ReportWizardStep1["exportFormat"],
                  })
                }
              >
                <MenuItem value="pdf">{t("fmtPdf")}</MenuItem>
                <MenuItem value="excel">{t("fmtExcel")}</MenuItem>
                <MenuItem value="csv">{t("fmtCsv")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("reportLanguage")}</InputLabel>
              <Select
                label={t("reportLanguage")}
                value={value.reportLanguage}
                onChange={(e) =>
                  onChange({
                    reportLanguage: e.target
                      .value as ReportWizardStep1["reportLanguage"],
                  })
                }
              >
                <MenuItem value="ar">{t("langAr")}</MenuItem>
                <MenuItem value="en">{t("langEn")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("paperSize")}</InputLabel>
              <Select
                label={t("paperSize")}
                value={value.paperSize}
                onChange={(e) =>
                  onChange({
                    paperSize: e.target.value as ReportWizardStep1["paperSize"],
                  })
                }
              >
                <MenuItem value="A4">{t("paperSizeA4")}</MenuItem>
                <MenuItem value="Letter">{t("paperSizeLetter")}</MenuItem>
                <MenuItem value="A3">{t("paperSizeA3")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("printOrientation")}</InputLabel>
              <Select
                label={t("printOrientation")}
                value={value.printOrientation}
                onChange={(e) =>
                  onChange({
                    printOrientation: e.target
                      .value as ReportWizardStep1["printOrientation"],
                  })
                }
              >
                <MenuItem value="portrait">{t("orientationPortrait")}</MenuItem>
                <MenuItem value="landscape">
                  {t("orientationLandscape")}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

function StackedTypes({
  options,
  selected,
  tRt,
}: {
  options: { id: string; disabled?: boolean }[];
  selected: string[];
  tRt: (key: string) => string;
}) {
  return (
    <Stack spacing={1}>
      {options.map((opt) => (
        <Paper
          key={opt.id}
          variant="outlined"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: "action.hover",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={selected.includes(opt.id)}
                disabled={opt.disabled ?? false}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {tRt(opt.id)}
              </Typography>
            }
          />
        </Paper>
      ))}
    </Stack>
  );
}
