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
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type {
  EmployeeContractTypeId,
  EmployeeStatusFilter,
  ReportWizardStep2,
} from "../types";
import {
  EMPLOYEE_CONTRACT_OPTIONS,
  STEP2_DEPARTMENT_VALUES,
  STEP2_FILTER_UNSET,
  STEP2_GENDER_VALUES,
  STEP2_JOB_TITLE_VALUES,
  STEP2_LOCATION_VALUES,
  STEP2_MANAGEMENT_VALUES,
  STEP2_NATIONALITY_VALUES,
} from "../constants-step2";

type Props = {
  value: ReportWizardStep2;
  onChange: (patch: Partial<ReportWizardStep2>) => void;
};

const STATUS_VALUES: EmployeeStatusFilter[] = [
  "all",
  "active",
  "inactive",
  "on_leave",
  "dismissed",
];

export default function WizardStep2({ value, onChange }: Props) {
  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const t = useTranslations("HRReports.attendanceReport.wizard.employeesData");
  const tLoc = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.branches",
  );
  const tMgmt = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.managements",
  );
  const tDept = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.departments",
  );
  const tJob = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.jobTitles",
  );
  const tNat = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.nationalities",
  );
  const tGender = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.genders",
  );
  const tContracts = useTranslations(
    "HRReports.attendanceReport.wizard.employeesData.contracts",
  );

  const labelStatus = (s: EmployeeStatusFilter) => {
    switch (s) {
      case "all":
        return t("statusAll");
      case "active":
        return t("statusActive");
      case "inactive":
        return t("statusInactive");
      case "on_leave":
        return t("statusOnLeave");
      case "dismissed":
        return t("statusDismissed");
      default:
        return s;
    }
  };

  const toggleContract = (id: EmployeeContractTypeId) => {
    const next = value.contractTypeIds.includes(id)
      ? value.contractTypeIds.filter((x) => x !== id)
      : [...value.contractTypeIds, id];
    onChange({ contractTypeIds: next });
  };

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
        <FormControl component="fieldset" variant="standard">
          <RadioGroup
            row
            name="employee-status"
            value={value.employeeStatus}
            onChange={(e) =>
              onChange({
                employeeStatus: e.target.value as EmployeeStatusFilter,
              })
            }
            sx={{
              flexWrap: "wrap",
              gap: { xs: 0.5, sm: 2 },
              "& .MuiFormControlLabel-root": { mr: { xs: 1, sm: 2 } },
            }}
          >
            {STATUS_VALUES.map((s) => (
              <FormControlLabel
                key={s}
                value={s}
                control={<Radio color="primary" size="small" />}
                label={<Typography variant="body2">{labelStatus(s)}</Typography>}
              />
            ))}
          </RadioGroup>
        </FormControl>
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
              <InputLabel>{t("fieldBranch")}</InputLabel>
              <Select
                label={t("fieldBranch")}
                value={value.location}
                onChange={(e) => onChange({ location: e.target.value })}
              >
                <MenuItem value={STEP2_FILTER_UNSET}>
                  <em>{t("filterNotSet")}</em>
                </MenuItem>
                {STEP2_LOCATION_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tLoc(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldManagement")}</InputLabel>
              <Select
                label={t("fieldManagement")}
                value={value.management}
                onChange={(e) => onChange({ management: e.target.value })}
              >
                <MenuItem value={STEP2_FILTER_UNSET}>
                  <em>{t("filterNotSet")}</em>
                </MenuItem>
                {STEP2_MANAGEMENT_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tMgmt(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldDepartment")}</InputLabel>
              <Select
                label={t("fieldDepartment")}
                value={value.department}
                onChange={(e) => onChange({ department: e.target.value })}
              >
                <MenuItem value={STEP2_FILTER_UNSET}>
                  <em>{t("filterNotSet")}</em>
                </MenuItem>
                {STEP2_DEPARTMENT_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tDept(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldJobTitle")}</InputLabel>
              <Select
                label={t("fieldJobTitle")}
                value={value.jobTitle}
                onChange={(e) => onChange({ jobTitle: e.target.value })}
              >
                <MenuItem value={STEP2_FILTER_UNSET}>
                  <em>{t("filterNotSet")}</em>
                </MenuItem>
                {STEP2_JOB_TITLE_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tJob(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            step: 3,
            title: t("section3Title"),
          })}
        </Typography>
        <Grid container spacing={1.5}>
          {EMPLOYEE_CONTRACT_OPTIONS.map(({ id }) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={value.contractTypeIds.includes(id)}
                    onChange={() => toggleContract(id)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2">{tContracts(id)}</Typography>
                }
              />
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Divider />

      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {tWizard("stepSectionHeading", {
            step: 4,
            title: t("section4Title"),
          })}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldNationality")}</InputLabel>
              <Select
                label={t("fieldNationality")}
                value={value.nationality}
                onChange={(e) => onChange({ nationality: e.target.value })}
              >
                <MenuItem value={STEP2_FILTER_UNSET}>
                  <em>{t("filterNotSet")}</em>
                </MenuItem>
                {STEP2_NATIONALITY_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tNat(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldGender")}</InputLabel>
              <Select
                label={t("fieldGender")}
                value={value.gender}
                onChange={(e) => onChange({ gender: e.target.value })}
              >
                {STEP2_GENDER_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tGender(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
