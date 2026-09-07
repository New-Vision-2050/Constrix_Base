"use client";

import React from "react";
import {
  Box,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import {
  attendanceDataTypeLabel,
  resolveWizardLocale,
} from "../attendance-data-type-labels";
import type {
  AttendanceDataTypeId,
  ReportDisplayModeId,
  ReportWizardStep3,
} from "../types";
import {
  ATTENDANCE_DATA_TYPE_OPTIONS,
  DISPLAY_MODE_VALUES,
  REQUIRED_ATTENDANCE_DATA_TYPE_IDS,
} from "../constants-step3";

type Props = {
  value: ReportWizardStep3;
  onChange: (patch: Partial<ReportWizardStep3>) => void;
};

export default function WizardStep3({ value, onChange }: Props) {
  const locale = resolveWizardLocale(useLocale());
  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const t = useTranslations("HRReports.attendanceReport.wizard.attendanceData");

  const selected = new Set(value.attendanceDataTypeIds);
  const requiredSet = new Set(REQUIRED_ATTENDANCE_DATA_TYPE_IDS);

  const emitDataTypeIds = (ids: AttendanceDataTypeId[]) => {
    onChange({
      attendanceDataTypeIds: [
        ...new Set([...REQUIRED_ATTENDANCE_DATA_TYPE_IDS, ...ids]),
      ],
    });
  };

  const toggleDataType = (id: AttendanceDataTypeId) => {
    if (requiredSet.has(id)) return;
    const next = selected.has(id)
      ? value.attendanceDataTypeIds.filter((x) => x !== id)
      : [...value.attendanceDataTypeIds, id];
    emitDataTypeIds(next);
  };

  const colA = ATTENDANCE_DATA_TYPE_OPTIONS.filter((o) => o.column === "a");
  const colB = ATTENDANCE_DATA_TYPE_OPTIONS.filter((o) => o.column === "b");

  const displayModeLabel = (mode: ReportDisplayModeId) =>
    mode === "employee_per_page"
      ? t("displayModeEmployeePerPage")
      : t("displayModeByDay");

  const renderColumn = (
    options: typeof ATTENDANCE_DATA_TYPE_OPTIONS,
    locked = false,
  ) => (
    <Stack spacing={1}>
      {options.map(({ id }) => (
        <Paper
          key={id}
          variant="outlined"
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            bgcolor: locked || selected.has(id) ? "background.paper" : "action.hover",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={locked || selected.has(id)}
                disabled={locked}
                onChange={() => toggleDataType(id)}
                color="primary"
                size="small"
              />
            }
            label={
              <Typography variant="body2" fontWeight={500}>
                {attendanceDataTypeLabel(id, locale)}
              </Typography>
            }
          />
        </Paper>
      ))}
    </Stack>
  );

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
            {renderColumn(
              REQUIRED_ATTENDANCE_DATA_TYPE_IDS.map((id) => ({
                id,
                column: "a" as const,
              })),
              true,
            )}
            {renderColumn(colA)}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>{renderColumn(colB)}</Grid>
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
            title: t("sectionDisplayModeTitle"),
          })}
        </Typography>
        <FormControl component="fieldset" variant="standard">
          <RadioGroup
            row
            name="attendance-display-mode"
            value={value.displayMode}
            onChange={(e) =>
              onChange({
                displayMode: e.target.value as ReportDisplayModeId,
              })
            }
            sx={{
              flexWrap: "wrap",
              gap: { xs: 0.5, sm: 2 },
              "& .MuiFormControlLabel-root": { mr: { xs: 1, sm: 2 } },
            }}
          >
            {DISPLAY_MODE_VALUES.map((mode) => (
              <FormControlLabel
                key={mode}
                value={mode}
                control={<Radio color="primary" size="small" />}
                label={
                  <Typography variant="body2">
                    {displayModeLabel(mode)}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>
    </Box>
  );
}
