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
import { useTranslations } from "next-intl";
import type { ReportDisplayModeId, ReportWizardStep3 } from "../types";
import {
  ATTENDANCE_DATA_TYPE_OPTIONS,
  DISPLAY_MODE_VALUES,
  STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS,
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

  React.useEffect(() => {
    const ids = value.attendanceDataTypeIds;
    const fixed = STEP3_ALL_ATTENDANCE_DATA_TYPE_IDS;
    const complete =
      ids.length === fixed.length &&
      fixed.every((id) => ids.includes(id));
    if (!complete) {
      onChange({ attendanceDataTypeIds: [...fixed] });
    }
  }, [value.attendanceDataTypeIds, onChange]);

  const colA = ATTENDANCE_DATA_TYPE_OPTIONS.filter((o) => o.column === "a");
  const colB = ATTENDANCE_DATA_TYPE_OPTIONS.filter((o) => o.column === "b");

  const displayModeLabel = (mode: ReportDisplayModeId) =>
    mode === "employee_per_page"
      ? t("displayModeEmployeePerPage")
      : t("displayModeByDay");

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
                        checked
                        disabled
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
                        checked
                        disabled
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
