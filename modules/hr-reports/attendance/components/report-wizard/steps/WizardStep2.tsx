"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Checkbox,
  CircularProgress,
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
  TextField,
  Typography,
} from "@mui/material";
import { useLocale, useTranslations } from "next-intl";
import type {
  EmployeeScopeMode,
  ReportWizardStep2,
} from "../types";
import {
  STEP2_FILTER_UNSET,
} from "../constants-step2";
import { useDebouncedValue } from "@/modules/table/hooks/useDebounce";
import {
  CONSTRAINT_SEARCH_DEBOUNCE_MS,
  useAttendanceWizardAttendanceConstraintsSearch,
  useAttendanceWizardBranches,
  useAttendanceWizardEmployees,
  useAttendanceWizardJobTitles,
  useAttendanceWizardManagements,
  type WizardAttendanceConstraintOption,
} from "../useAttendanceWizardStep2Queries";

type Props = {
  value: ReportWizardStep2;
  onChange: (patch: Partial<ReportWizardStep2>) => void;
};

const SCOPE_VALUES: EmployeeScopeMode[] = ["all", "select_employees"];

export default function WizardStep2({ value, onChange }: Props) {
  const locale = useLocale();
  const tWizard = useTranslations("HRReports.attendanceReport.wizard");
  const t = useTranslations("HRReports.attendanceReport.wizard.employeesData");

  const branchSelected =
    value.branchId !== STEP2_FILTER_UNSET && value.branchId.trim() !== "";

  const branchesQuery = useAttendanceWizardBranches();
  const managementQuery = useAttendanceWizardManagements(
    branchSelected ? value.branchId : undefined,
  );
  const jobTitlesQuery = useAttendanceWizardJobTitles();
  const [constraintSearch, setConstraintSearch] = useState("");
  const debouncedConstraintSearch = useDebouncedValue(
    constraintSearch,
    CONSTRAINT_SEARCH_DEBOUNCE_MS,
  );
  const constraintsQuery = useAttendanceWizardAttendanceConstraintsSearch({
    search: debouncedConstraintSearch,
    branchId: value.branchId,
    managementId: value.managementId,
    jobTitleId: value.jobTitleId,
  });
  const employeesQuery = useAttendanceWizardEmployees({
    enabled: value.employeeScope === "select_employees",
    branchId: value.branchId,
    attendanceConstraintIds: value.attendanceConstraintIds,
  });

  const branchOptions = branchesQuery.data ?? [];
  const managementOptions = managementQuery.data ?? [];
  const jobTitleOptions = jobTitlesQuery.data ?? [];

  const constraintOptionsFromApi = useMemo(() => {
    const merged: WizardAttendanceConstraintOption[] = [];
    const seen = new Set<string>();

    for (const page of constraintsQuery.data?.pages ?? []) {
      for (const item of page.items) {
        if (!seen.has(item.id)) {
          seen.add(item.id);
          merged.push(item);
        }
      }
    }

    return merged;
  }, [constraintsQuery.data]);

  const constraintOptions = useMemo(() => {
    const byId = new Map(
      constraintOptionsFromApi.map((option) => [option.id, option]),
    );

    for (const id of value.attendanceConstraintIds) {
      if (!byId.has(id)) {
        byId.set(id, {
          id,
          constraint_name: id,
          is_active: true,
          label: { ar: id, en: id },
        });
      }
    }

    return [...byId.values()];
  }, [constraintOptionsFromApi, value.attendanceConstraintIds]);

  const selectedConstraints = useMemo(
    () =>
      constraintOptions.filter((option) =>
        value.attendanceConstraintIds.includes(option.id),
      ),
    [constraintOptions, value.attendanceConstraintIds],
  );

  const handleConstraintListboxScroll = useCallback(
    (event: React.UIEvent<HTMLElement>) => {
      const target = event.currentTarget;
      const nearBottom =
        target.scrollTop + target.clientHeight >= target.scrollHeight - 40;

      if (
        nearBottom &&
        constraintsQuery.hasNextPage &&
        !constraintsQuery.isFetchingNextPage
      ) {
        void constraintsQuery.fetchNextPage();
      }
    },
    [
      constraintsQuery.fetchNextPage,
      constraintsQuery.hasNextPage,
      constraintsQuery.isFetchingNextPage,
    ],
  );

  const constraintListboxComponent = useMemo(
    () =>
      React.forwardRef<
        HTMLUListElement,
        React.HTMLAttributes<HTMLElement>
      >(function ConstraintListbox(props, ref) {
        const { children, onScroll, style, ...rest } = props;

        return (
          <ul
            ref={ref}
            {...rest}
            onScroll={(event) => {
              onScroll?.(event);
              handleConstraintListboxScroll(event);
            }}
            style={{
              ...style,
              maxHeight: 320,
              overflow: "auto",
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {children}
          </ul>
        );
      }),
    [handleConstraintListboxScroll],
  );

  const constraintLabel = (opt: WizardAttendanceConstraintOption) =>
    locale === "ar" ? opt.label.ar : opt.label.en;

  const selectedEmployees = React.useMemo(() => {
    const opts = employeesQuery.data ?? [];
    return opts.filter((o) => value.employeeUserIds.includes(o.id));
  }, [employeesQuery.data, value.employeeUserIds]);

  const labelScope = (s: EmployeeScopeMode) =>
    s === "all" ? t("statusAll") : t("scopeSelectEmployees");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper
        variant="outlined"
        sx={{ p: 2, borderRadius: 2, bgcolor: "action.hover" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          {tWizard("stepSectionHeading", {
            step: 1,
            title: t("section2Title"),
          })}
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>{t("fieldBranch")}</InputLabel>
              <Select
                label={t("fieldBranch")}
                value={value.branchId}
                disabled={branchesQuery.isLoading}
                onChange={(e) => {
                  const id = String(e.target.value);
                  const row = branchOptions.find((b) => b.id === id);
                  const patch: Partial<ReportWizardStep2> = {
                    branchId: id,
                    branchName: row?.name,
                    managementId: STEP2_FILTER_UNSET,
                    managementName: undefined,
                  };
                  if (
                    branchSelected &&
                    id !== STEP2_FILTER_UNSET &&
                    id !== value.branchId
                  ) {
                    patch.employeeUserIds = [];
                  }
                  onChange(patch);
                }}
              >
                <MenuItem value={STEP2_FILTER_UNSET}>
                  <em>{t("filterNotSet")}</em>
                </MenuItem>
                {branchOptions.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.name}
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
                value={value.managementId}
                disabled={!branchSelected || managementQuery.isLoading}
                onChange={(e) => {
                  const id = String(e.target.value);
                  const row = managementOptions.find((m) => m.id === id);
                  onChange({
                    managementId: id,
                    managementName: row?.name,
                  });
                }}
              >
                <MenuItem value={STEP2_FILTER_UNSET}>
                  <em>{t("filterNotSet")}</em>
                </MenuItem>
                {managementOptions.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name}
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
                value={value.jobTitleId}
                disabled={jobTitlesQuery.isLoading}
                onChange={(e) => {
                  const id = String(e.target.value);
                  const row = jobTitleOptions.find((j) => j.id === id);
                  onChange({
                    jobTitleId: id,
                    jobTitleName: row?.name,
                  });
                }}
              >
                <MenuItem value={STEP2_FILTER_UNSET}>
                  <em>{t("filterNotSet")}</em>
                </MenuItem>
                {jobTitleOptions.map((j) => (
                  <MenuItem key={j.id} value={j.id}>
                    {j.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={constraintOptions}
              loading={constraintsQuery.isLoading || constraintsQuery.isFetching}
              value={selectedConstraints}
              inputValue={constraintSearch}
              filterOptions={(opts) => opts}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              getOptionKey={(opt) => opt.id}
              getOptionLabel={constraintLabel}
              onInputChange={(_, inputValue, reason) => {
                if (reason === "input" || reason === "clear") {
                  setConstraintSearch(inputValue);
                }
              }}
              onChange={(_, v) =>
                onChange({
                  attendanceConstraintIds: v.map((o) => o.id),
                })
              }
              ListboxComponent={
                constraintListboxComponent as React.ComponentType<
                  React.HTMLAttributes<HTMLElement>
                >
              }
              renderOption={(props, option, { selected }) => {
                const { key, ...listItemProps } = props;
                return (
                  <li key={key ?? option.id} {...listItemProps}>
                    <Checkbox
                      style={{ marginInlineEnd: 8 }}
                      checked={selected}
                      size="small"
                    />
                    {constraintLabel(option)}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("fieldAttendanceConstraints")}
                  size="small"
                  placeholder={t("attendanceConstraintsPickerLabel")}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {constraintsQuery.isLoading ||
                        constraintsQuery.isFetching ? (
                          <CircularProgress
                            color="inherit"
                            size={18}
                            sx={{ mr: 1 }}
                          />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
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
            title: t("section1Title"),
          })}
        </Typography>
        <FormControl component="fieldset" variant="standard">
          <RadioGroup
            row
            name="employee-scope"
            value={value.employeeScope}
            onChange={(e) => {
              const mode = e.target.value as EmployeeScopeMode;
              onChange({
                employeeScope: mode,
                ...(mode === "all" ? { employeeUserIds: [] } : {}),
              });
            }}
            sx={{
              flexWrap: "wrap",
              gap: { xs: 0.5, sm: 2 },
              "& .MuiFormControlLabel-root": { mr: { xs: 1, sm: 2 } },
            }}
          >
            {SCOPE_VALUES.map((s) => (
              <FormControlLabel
                key={s}
                value={s}
                control={<Radio color="primary" size="small" />}
                label={
                  <Typography variant="body2">{labelScope(s)}</Typography>
                }
              />
            ))}
          </RadioGroup>
        </FormControl>

        {value.employeeScope === "select_employees" ? (
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={employeesQuery.data ?? []}
              loading={employeesQuery.isFetching}
              value={selectedEmployees}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              getOptionLabel={(o) => o.name}
              onChange={(_, v) =>
                onChange({
                  employeeUserIds: v.map((o) => o.id),
                })
              }
              renderOption={(props, option, { selected }) => {
                const { key, ...listItemProps } = props;
                return (
                  <li key={key ?? option.id} {...listItemProps}>
                    <Checkbox
                      style={{ marginInlineEnd: 8 }}
                      checked={selected}
                      size="small"
                    />
                    {option.name}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("employeePickerLabel")}
                  size="small"
                  placeholder={t("scopeSelectEmployees")}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {employeesQuery.isFetching ? (
                          <CircularProgress color="inherit" size={18} sx={{ mr: 1 }} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
            {!employeesQuery.isFetching &&
            (employeesQuery.data ?? []).length === 0 ? (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                {t("employeePickerEmpty")}
              </Typography>
            ) : null}
          </Box>
        ) : null}
      </Paper>

      {/* <Divider />

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
      </Paper> */}
    </Box>
  );
}
