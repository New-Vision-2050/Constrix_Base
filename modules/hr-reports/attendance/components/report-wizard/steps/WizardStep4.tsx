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
  Switch,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type {
  ReportWizardStep4,
  SalaryComponentId,
  SalaryDeductionId,
  SalaryDisbursementStatus,
} from "../types";
import {
  DISBURSEMENT_STATUS_VALUES,
  SALARY_COMPONENT_OPTIONS,
  SALARY_DEDUCTION_OPTIONS,
} from "../constants-step4";

type Props = {
  value: ReportWizardStep4;
  onChange: (patch: Partial<ReportWizardStep4>) => void;
};

export default function WizardStep4({ value, onChange }: Props) {
  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const t = useTranslations("HRReports.attendanceReport.wizard.salaryData");
  const tComp = useTranslations(
    "HRReports.attendanceReport.wizard.salaryData.salaryComponents",
  );
  const tDed = useTranslations(
    "HRReports.attendanceReport.wizard.salaryData.deductions",
  );

  const colCompA = SALARY_COMPONENT_OPTIONS.filter((o) => o.column === "a");
  const colCompB = SALARY_COMPONENT_OPTIONS.filter((o) => o.column === "b");
  const colDedA = SALARY_DEDUCTION_OPTIONS.filter((o) => o.column === "a");
  const colDedB = SALARY_DEDUCTION_OPTIONS.filter((o) => o.column === "b");

  const toggleComponent = (id: SalaryComponentId) => {
    const next = value.salaryComponentIds.includes(id)
      ? value.salaryComponentIds.filter((x) => x !== id)
      : [...value.salaryComponentIds, id];
    onChange({ salaryComponentIds: next });
  };

  const toggleDeduction = (id: SalaryDeductionId) => {
    const next = value.deductionIds.includes(id)
      ? value.deductionIds.filter((x) => x !== id)
      : [...value.deductionIds, id];
    onChange({ deductionIds: next });
  };

  const labelDisbursement = (s: SalaryDisbursementStatus) => {
    switch (s) {
      case "all":
        return t("disbursementAll");
      case "disbursed":
        return t("disbursementPaid");
      case "pending_approval":
        return t("disbursementPending");
      case "suspended":
        return t("disbursementSuspended");
      default:
        return s;
    }
  };

  function ToggleRow({
    checked,
    onToggle,
    titleKey,
    descKey,
  }: {
    checked: boolean;
    onToggle: (next: boolean) => void;
    titleKey:
      | "toggleNetTitle"
      | "toggleCompareSalTitle"
      | "toggleSeparatePageTitle"
      | "toggleSummaryTitle";
    descKey:
      | "toggleNetDesc"
      | "toggleCompareSalDesc"
      | "toggleSeparatePageDesc"
      | "toggleSummaryDesc";
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
      {/* Section 1 */}
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
              {colCompA.map(({ id }) => (
                <Paper
                  key={id}
                  variant="outlined"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.salaryComponentIds.includes(id)}
                        onChange={() => toggleComponent(id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {tComp(id)}
                      </Typography>
                    }
                  />
                </Paper>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              {colCompB.map(({ id }) => (
                <Paper
                  key={id}
                  variant="outlined"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.salaryComponentIds.includes(id)}
                        onChange={() => toggleComponent(id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {tComp(id)}
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

      {/* Section 2 */}
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
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              {colDedA.map(({ id }) => (
                <Paper
                  key={id}
                  variant="outlined"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.deductionIds.includes(id)}
                        onChange={() => toggleDeduction(id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {tDed(id)}
                      </Typography>
                    }
                  />
                </Paper>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              {colDedB.map(({ id }) => (
                <Paper
                  key={id}
                  variant="outlined"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.deductionIds.includes(id)}
                        onChange={() => toggleDeduction(id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {tDed(id)}
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

      {/* Section 3 */}
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {tWizard("stepSectionHeading", {
            step: 3,
            title: t("section3Title"),
          })}
        </Typography>
        <FormControl component="fieldset" variant="standard">
          <RadioGroup
            row
            name="disbursement-status"
            value={value.disbursementStatus}
            onChange={(e) =>
              onChange({
                disbursementStatus: e.target
                  .value as SalaryDisbursementStatus,
              })
            }
            sx={{
              flexWrap: "wrap",
              gap: { xs: 0.5, sm: 2 },
              "& .MuiFormControlLabel-root": { mr: { xs: 1, sm: 2 } },
            }}
          >
            {DISBURSEMENT_STATUS_VALUES.map((s) => (
              <FormControlLabel
                key={s}
                value={s}
                control={<Radio color="primary" size="small" />}
                label={
                  <Typography variant="body2">
                    {labelDisbursement(s)}
                  </Typography>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Paper>

      <Divider />

      {/* Section 4 */}
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {tWizard("stepSectionHeading", {
            step: 4,
            title: t("section4Title"),
          })}
        </Typography>
        <Stack spacing={1.5}>
          <ToggleRow
            checked={value.netSalaryOnly}
            onToggle={(next) => onChange({ netSalaryOnly: next })}
            titleKey="toggleNetTitle"
            descKey="toggleNetDesc"
          />
          <ToggleRow
            checked={value.compareWithPreviousMonth}
            onToggle={(next) =>
              onChange({ compareWithPreviousMonth: next })
            }
            titleKey="toggleCompareSalTitle"
            descKey="toggleCompareSalDesc"
          />
          <ToggleRow
            checked={value.employeeDetailsSeparatePage}
            onToggle={(next) =>
              onChange({ employeeDetailsSeparatePage: next })
            }
            titleKey="toggleSeparatePageTitle"
            descKey="toggleSeparatePageDesc"
          />
          <ToggleRow
            checked={value.addTotalSummaryEnd}
            onToggle={(next) => onChange({ addTotalSummaryEnd: next })}
            titleKey="toggleSummaryTitle"
            descKey="toggleSummaryDesc"
          />
        </Stack>
      </Box>
    </Box>
  );
}
