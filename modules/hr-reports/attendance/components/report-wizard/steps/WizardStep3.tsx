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
  Switch,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type {
  AttendancePatternId,
  AttendanceRateMinId,
  AttendanceDataTypeId,
  DelayLimitMinutesId,
  MinOvertimeId,
  ReportWizardStep3,
} from "../types";
import {
  ATTENDANCE_DATA_TYPE_OPTIONS,
  STEP3_DELAY_VALUES,
  STEP3_OVERTIME_VALUES,
  STEP3_PATTERN_VALUES,
  STEP3_RATE_MIN_VALUES,
} from "../constants-step3";

type Props = {
  value: ReportWizardStep3;
  onChange: (patch: Partial<ReportWizardStep3>) => void;
};

export default function WizardStep3({ value, onChange }: Props) {
  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const t = useTranslations("HRReports.attendanceReport.wizard.attendanceData");
  const tTypes = useTranslations(
    "HRReports.attendanceReport.wizard.attendanceData.dataTypes",
  );
  const tPatterns = useTranslations(
    "HRReports.attendanceReport.wizard.attendanceData.patterns",
  );
  const tRate = useTranslations(
    "HRReports.attendanceReport.wizard.attendanceData.rateFilters",
  );
  const tDelay = useTranslations(
    "HRReports.attendanceReport.wizard.attendanceData.delayLimits",
  );
  const tOt = useTranslations(
    "HRReports.attendanceReport.wizard.attendanceData.minOvertimeOpts",
  );

  const colA = ATTENDANCE_DATA_TYPE_OPTIONS.filter((o) => o.column === "a");
  const colB = ATTENDANCE_DATA_TYPE_OPTIONS.filter((o) => o.column === "b");

  const toggleDataType = (id: AttendanceDataTypeId) => {
    const next = value.attendanceDataTypeIds.includes(id)
      ? value.attendanceDataTypeIds.filter((x) => x !== id)
      : [...value.attendanceDataTypeIds, id];
    onChange({ attendanceDataTypeIds: next });
  };

  function ToggleRow({
    checked,
    onToggle,
    titleKey,
    descKey,
  }: {
    checked: boolean;
    onToggle: (next: boolean) => void;
    titleKey: "toggleEntryTitle" | "toggleShiftTitle" | "toggleNotesTitle" | "toggleHoursTitle" | "toggleCompareTitle";
    descKey: "toggleEntryDesc" | "toggleShiftDesc" | "toggleNotesDesc" | "toggleHoursDesc" | "toggleCompareDesc";
  }) {
    return (
      <Paper
        variant="outlined"
        sx={{
          px: 2,
          py: 1.5,
          borderRadius: 2,
          bgcolor: "action.hover",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="body2" fontWeight={600}>
              {t(titleKey)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t(descKey)}
            </Typography>
          </Box>
          <Switch
            checked={checked}
            onChange={(_, v) => onToggle(v)}
            color="primary"
          />
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {tWizard("stepSectionHeading", {
            step: 1,
            title: t("section1Title"),
          })}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              {colA.map(({ id }) => (
                <Paper
                  key={id}
                  variant="outlined"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.attendanceDataTypeIds.includes(id)}
                        onChange={() => toggleDataType(id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {tTypes(id)}
                      </Typography>
                    }
                  />
                </Paper>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              {colB.map(({ id }) => (
                <Paper
                  key={id}
                  variant="outlined"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.attendanceDataTypeIds.includes(id)}
                        onChange={() => toggleDataType(id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {tTypes(id)}
                      </Typography>
                    }
                  />
                </Paper>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Divider />

      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {tWizard("stepSectionHeading", {
            step: 2,
            title: t("section2Title"),
          })}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldAttendancePattern")}</InputLabel>
              <Select
                label={t("fieldAttendancePattern")}
                value={value.attendancePattern}
                onChange={(e) =>
                  onChange({
                    attendancePattern:
                      e.target.value as AttendancePatternId,
                  })
                }
              >
                {STEP3_PATTERN_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tPatterns(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldAttendanceRate")}</InputLabel>
              <Select
                label={t("fieldAttendanceRate")}
                value={value.attendanceRateMin}
                onChange={(e) =>
                  onChange({
                    attendanceRateMin:
                      e.target.value as AttendanceRateMinId,
                  })
                }
              >
                {STEP3_RATE_MIN_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tRate(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldDelayLimit")}</InputLabel>
              <Select
                label={t("fieldDelayLimit")}
                value={value.delayLimitMinutes}
                onChange={(e) =>
                  onChange({
                    delayLimitMinutes:
                      e.target.value as DelayLimitMinutesId,
                  })
                }
              >
                {STEP3_DELAY_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tDelay(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldMinOvertime")}</InputLabel>
              <Select
                label={t("fieldMinOvertime")}
                value={value.minOvertime}
                onChange={(e) =>
                  onChange({
                    minOvertime: e.target.value as MinOvertimeId,
                  })
                }
              >
                {STEP3_OVERTIME_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tOt(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      <Divider />

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {tWizard("stepSectionHeading", {
            step: 3,
            title: t("section3Title"),
          })}
        </Typography>
        <Stack spacing={1.5}>
          <ToggleRow
            checked={value.includeEntryExitTime}
            onToggle={(next) => onChange({ includeEntryExitTime: next })}
            titleKey="toggleEntryTitle"
            descKey="toggleEntryDesc"
          />
          <ToggleRow
            checked={value.includeShiftName}
            onToggle={(next) => onChange({ includeShiftName: next })}
            titleKey="toggleShiftTitle"
            descKey="toggleShiftDesc"
          />
          <ToggleRow
            checked={value.includeAttendanceNotes}
            onToggle={(next) => onChange({ includeAttendanceNotes: next })}
            titleKey="toggleNotesTitle"
            descKey="toggleNotesDesc"
          />
          <ToggleRow
            checked={value.calculateTotalWorkHours}
            onToggle={(next) => onChange({ calculateTotalWorkHours: next })}
            titleKey="toggleHoursTitle"
            descKey="toggleHoursDesc"
          />
          <ToggleRow
            checked={value.showPreviousMonthComparison}
            onToggle={(next) =>
              onChange({ showPreviousMonthComparison: next })
            }
            titleKey="toggleCompareTitle"
            descKey="toggleCompareDesc"
          />
        </Stack>
      </Box>
    </Box>
  );
}
