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
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import type {
  ReportEmployeesPerPageId,
  ReportGroupById,
  ReportMainSortById,
  ReportSortDirectionId,
  ReportWizardStep5,
  VisualElementId,
} from "../types";
import {
  STEP5_EMPLOYEES_PER_PAGE_VALUES,
  STEP5_GROUP_BY_VALUES,
  STEP5_MAIN_SORT_VALUES,
  STEP5_SORT_DIRECTION_VALUES,
  VISUAL_ELEMENT_OPTIONS,
} from "../constants-step5";

type Props = {
  value: ReportWizardStep5;
  onChange: (patch: Partial<ReportWizardStep5>) => void;
};

export default function WizardStep5({ value, onChange }: Props) {
  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const t = useTranslations("HRReports.attendanceReport.wizard.filtersOptions");
  const tMain = useTranslations(
    "HRReports.attendanceReport.wizard.filtersOptions.mainSortValues",
  );
  const tDir = useTranslations(
    "HRReports.attendanceReport.wizard.filtersOptions.sortDirections",
  );
  const tGroup = useTranslations(
    "HRReports.attendanceReport.wizard.filtersOptions.groupByValues",
  );
  const tPer = useTranslations(
    "HRReports.attendanceReport.wizard.filtersOptions.perPageValues",
  );
  const tVis = useTranslations(
    "HRReports.attendanceReport.wizard.filtersOptions.visuals",
  );

  const colVisA = VISUAL_ELEMENT_OPTIONS.filter((o) => o.column === "a");
  const colVisB = VISUAL_ELEMENT_OPTIONS.filter((o) => o.column === "b");

  const toggleVisual = (id: VisualElementId) => {
    const next = value.visualElementIds.includes(id)
      ? value.visualElementIds.filter((x) => x !== id)
      : [...value.visualElementIds, id];
    onChange({ visualElementIds: next });
  };

  function DeliveryToggle({
    checked,
    onToggle,
    titleKey,
    descKey,
  }: {
    checked: boolean;
    onToggle: (v: boolean) => void;
    titleKey:
      | "toggleAutoEmailTitle"
      | "toggleManagerCopyTitle"
      | "toggleMonthlyScheduleTitle"
      | "toggleHeaderFooterTitle"
      | "toggleSignatureTitle";
    descKey:
      | "toggleAutoEmailDesc"
      | "toggleManagerCopyDesc"
      | "toggleMonthlyScheduleDesc"
      | "toggleHeaderFooterDesc"
      | "toggleSignatureDesc";
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldMainSort")}</InputLabel>
              <Select
                label={t("fieldMainSort")}
                value={value.mainSortBy}
                onChange={(e) =>
                  onChange({
                    mainSortBy: e.target.value as ReportMainSortById,
                  })
                }
              >
                {STEP5_MAIN_SORT_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tMain(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldSortDirection")}</InputLabel>
              <Select
                label={t("fieldSortDirection")}
                value={value.sortDirection}
                onChange={(e) =>
                  onChange({
                    sortDirection: e.target.value as ReportSortDirectionId,
                  })
                }
              >
                {STEP5_SORT_DIRECTION_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tDir(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldGroupBy")}</InputLabel>
              <Select
                label={t("fieldGroupBy")}
                value={value.groupBy}
                onChange={(e) =>
                  onChange({ groupBy: e.target.value as ReportGroupById })
                }
              >
                {STEP5_GROUP_BY_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tGroup(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldPerPage")}</InputLabel>
              <Select
                label={t("fieldPerPage")}
                value={value.employeesPerPage}
                onChange={(e) =>
                  onChange({
                    employeesPerPage:
                      e.target.value as ReportEmployeesPerPageId,
                  })
                }
              >
                {STEP5_EMPLOYEES_PER_PAGE_VALUES.map((v) => (
                  <MenuItem key={v} value={v}>
                    {tPer(v)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
              {colVisA.map(({ id }) => (
                <Paper
                  key={id}
                  variant="outlined"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.visualElementIds.includes(id)}
                        onChange={() => toggleVisual(id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {tVis(id)}
                      </Typography>
                    }
                  />
                </Paper>
              ))}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack spacing={1}>
              {colVisB.map(({ id }) => (
                <Paper
                  key={id}
                  variant="outlined"
                  sx={{ px: 1.5, py: 0.5, borderRadius: 2 }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={value.visualElementIds.includes(id)}
                        onChange={() => toggleVisual(id)}
                        color="primary"
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" fontWeight={500}>
                        {tVis(id)}
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
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {tWizard("stepSectionHeading", {
            step: 3,
            title: t("section3Title"),
          })}
        </Typography>
        <Stack spacing={1.5}>
          <DeliveryToggle
            checked={value.autoEmail}
            onToggle={(v) => onChange({ autoEmail: v })}
            titleKey="toggleAutoEmailTitle"
            descKey="toggleAutoEmailDesc"
          />
          <DeliveryToggle
            checked={value.copyToManager}
            onToggle={(v) => onChange({ copyToManager: v })}
            titleKey="toggleManagerCopyTitle"
            descKey="toggleManagerCopyDesc"
          />
          <DeliveryToggle
            checked={value.monthlyScheduling}
            onToggle={(v) => onChange({ monthlyScheduling: v })}
            titleKey="toggleMonthlyScheduleTitle"
            descKey="toggleMonthlyScheduleDesc"
          />
          <DeliveryToggle
            checked={value.companyHeaderFooter}
            onToggle={(v) => onChange({ companyHeaderFooter: v })}
            titleKey="toggleHeaderFooterTitle"
            descKey="toggleHeaderFooterDesc"
          />
          <DeliveryToggle
            checked={value.digitalSignature}
            onToggle={(v) => onChange({ digitalSignature: v })}
            titleKey="toggleSignatureTitle"
            descKey="toggleSignatureDesc"
          />
          <TextField
            fullWidth
            size="small"
            label={t("fieldRecipientEmails")}
            placeholder={t("emailsPlaceholder")}
            value={value.recipientEmails}
            onChange={(e) =>
              onChange({ recipientEmails: e.target.value })
            }
            multiline
            minRows={2}
          />
        </Stack>
      </Box>
    </Box>
  );
}
