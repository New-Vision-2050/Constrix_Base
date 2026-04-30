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
  Typography,
} from "@mui/material";
import type { ReportWizardStep1, ReportTypeId } from "../types";
import { REPORT_TYPE_OPTIONS } from "../constants";
import { useTranslations } from "next-intl";

type Props = {
  value: ReportWizardStep1;
  onChange: (patch: Partial<ReportWizardStep1>) => void;
};

const MONTH_KEYS = [
  "m1",
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "m8",
  "m9",
  "m10",
  "m11",
  "m12",
] as const;

export default function WizardStep1({ value, onChange }: Props) {
  const t = useTranslations("HRReports.attendanceReport.wizard");
  const tRt = useTranslations(
    "HRReports.attendanceReport.wizard.reportTypes",
  );
  const tMonth = useTranslations("HRReports.attendanceReport.wizard.month");

  const colA = REPORT_TYPE_OPTIONS.filter((o) => o.column === "a" && !o.disabled);
  const colB = REPORT_TYPE_OPTIONS.filter((o) => o.column === "b" && !o.disabled);

  const toggleType = (id: string) => {
    const next = value.reportTypeIds.includes(id as ReportTypeId)
      ? value.reportTypeIds.filter((x) => x !== id)
      : [...value.reportTypeIds, id as ReportTypeId];
    onChange({ reportTypeIds: next });
  };

  const years = React.useMemo(() => {
    const y = new Date().getFullYear();
    return [y - 1, y, y + 1, y + 2];
  }, []);

  const months = React.useMemo(
    () => Array.from({ length: 12 }, (_, i) => i + 1),
    [],
  );

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
              onToggle={toggleType}
              tRt={tRt}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <StackedTypes
              options={colB}
              selected={value.reportTypeIds}
              onToggle={toggleType}
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
            <FormControl fullWidth size="small">
              <InputLabel id="period-type-label">{t("periodType")}</InputLabel>
              <Select
                labelId="period-type-label"
                label={t("periodType")}
                value={value.periodType}
                onChange={(e) => {
                  const pt = e.target.value as ReportWizardStep1["periodType"];
                  const patch: Partial<ReportWizardStep1> = {
                    periodType: pt,
                  };
                  if (pt === "quarterly") {
                    patch.quarter =
                      value.quarter ?? Math.ceil(value.month / 3);
                    patch.week = null;
                  } else if (pt === "yearly") {
                    patch.quarter = null;
                    patch.week = null;
                  } else if (pt === "weekly") {
                    patch.quarter = null;
                  } else {
                    patch.quarter = null;
                    patch.week = null;
                  }
                  onChange(patch);
                }}
              >
                <MenuItem value="monthly">{t("periodMonthly")}</MenuItem>
                <MenuItem value="weekly">{t("periodWeekly")}</MenuItem>
                <MenuItem value="quarterly">{t("periodQuarterly")}</MenuItem>
                <MenuItem value="yearly">{t("periodYearly")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="year-label">{t("year")}</InputLabel>
              <Select
                labelId="year-label"
                label={t("year")}
                value={value.year}
                onChange={(e) => onChange({ year: Number(e.target.value) })}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {(value.periodType === "monthly" ||
            value.periodType === "weekly") && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="month-label">{t("monthField")}</InputLabel>
                <Select
                  labelId="month-label"
                  label={t("monthField")}
                  value={value.month}
                  onChange={(e) => onChange({ month: Number(e.target.value) })}
                >
                  {months.map((m) => (
                    <MenuItem key={m} value={m}>
                      {tMonth(MONTH_KEYS[m - 1])}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
          {value.periodType === "quarterly" && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="quarter-label">{t("quarterField")}</InputLabel>
                <Select
                  labelId="quarter-label"
                  label={t("quarterField")}
                  value={value.quarter ?? Math.ceil(value.month / 3)}
                  onChange={(e) =>
                    onChange({ quarter: Number(e.target.value) })
                  }
                >
                  {[1, 2, 3, 4].map((q) => (
                    <MenuItem key={q} value={q}>
                      Q{q}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}
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
                <MenuItem value="pdf">PDF</MenuItem>
                <MenuItem value="excel">{t("fmtExcel")}</MenuItem>
                <MenuItem value="csv">CSV</MenuItem>
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
                <MenuItem value="A4">A4</MenuItem>
                <MenuItem value="Letter">Letter</MenuItem>
                <MenuItem value="A3">A3</MenuItem>
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
  onToggle,
  tRt,
}: {
  options: { id: string }[];
  selected: string[];
  onToggle: (id: string) => void;
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
                onChange={() => onToggle(opt.id)}
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
