"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormLabel,
  Box,
  Switch,
  Typography,
  FormHelperText,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "@/config/axios-config";
import IconPicker from "@/components/shared/icon-picker";
import {
  fetchManagementHierarchyOptions,
  type ManagementHierarchyOption,
} from "@/utils/fetchDropdownOptions";
import { APP_ICONS } from "@/constants/icons";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { getProcedureSettingsTabTitle } from "../../utils/getProcedureTabTitle";

const PROCEDURE_DIALOG_ICON_IDS = [
  "person-outline",
  "account-circle",
  "settings",
  "home",
  "alternate-email",
  "notifications",
  "inventory",
] as const;

const PROCEDURE_DIALOG_ICONS = APP_ICONS.filter((icon) =>
  PROCEDURE_DIALOG_ICON_IDS.includes(
    icon.id as (typeof PROCEDURE_DIALOG_ICON_IDS)[number],
  ),
);

interface AddStageDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (stage: {
    name: string;
    type: string;
    execute_type: string;
    icon: string;
    percentage: number;
    deadline_days: number;
    deadline_hours: number;
    escalation_management_hierarchy_id: string;
  }) => void;
  currentTabType?: string;
}

export default function AddStageDialog({
  open,
  onClose,
  onSuccess,
  currentTabType = "employee_task_request",
}: AddStageDialogProps) {
  const t = useTranslations("hr-settings.proceduresSettings.stages");
  const tRoot = useTranslations("hr-settings.proceduresSettings");
  const tc = useTranslations("hr-settings.proceduresSettings.common");

  const [name, setName] = useState("");
  const [sequentialApproval, setSequentialApproval] = useState(true);
  const [parallelApproval, setParallelApproval] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");
  const [deadlineHours, setDeadlineHours] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [escalationUserId, setEscalationUserId] = useState("");

  const { data: managements = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["managements", "hierarchy", "management"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=management`,
      ),
  });
  const [errors, setErrors] = useState<{
    name: string;
    percentage: string;
    timeLimit: string;
  }>({ name: "", percentage: "", timeLimit: "" });

  const handleSubmit = () => {
    const percentageValue = parseInt(durationPercentage) || 0;
    const newErrors = {
      name: !name.trim() ? tc("requiredField") : "",
      percentage:
        durationPercentage !== "" && percentageValue > 100
          ? t("percentageMax")
          : "",
      timeLimit:
        !deadlineHours && !deadlineDays ? tc("enterHoursOrDays") : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    onSuccess({
      name: name.trim(),
      type: currentTabType,
      execute_type: sequentialApproval ? "sequence" : "parallel",
      icon: selectedIcon || "approval-icon",
      percentage: percentageValue,
      deadline_days: parseInt(deadlineDays) || 0,
      deadline_hours: parseInt(deadlineHours) || 0,
      escalation_management_hierarchy_id: escalationUserId,
    });
    handleClose();
  };

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleClose = () => {
    setName("");
    setSequentialApproval(true);
    setParallelApproval(false);
    setSelectedIcon(null);
    setDurationPercentage("");
    setDeadlineHours("");
    setDeadlineDays("");
    setEscalationUserId("");
    setErrors({ name: "", percentage: "", timeLimit: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "start", pb: 1 }}>
        {getProcedureSettingsTabTitle(currentTabType, tRoot)}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", gap: 3, pt: 1 }}>
          {/* ── Left column ── */}
          <Box
            sx={{
              width: 270,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Sequential approval card */}
            <Box
              sx={{
                border: 1,
                borderColor: sequentialApproval ? "secondary.main" : "divider",
                borderRadius: 2,
                p: 2,
                textAlign: "end",
                bgcolor: "action.hover",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Switch
                  checked={sequentialApproval}
                  onChange={(e) => {
                    setSequentialApproval(e.target.checked);
                    setParallelApproval(!e.target.checked);
                  }}
                  color="secondary"
                />
              </Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {t("sequentialApproval")}
              </Typography>
            </Box>

            {/* Parallel approval card */}
            <Box
              sx={{
                border: 1,
                borderColor: parallelApproval ? "primary.main" : "divider",
                borderRadius: 2,
                p: 2,
                textAlign: "end",
                bgcolor: "action.hover",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
                <Switch
                  checked={parallelApproval}
                  onChange={(e) => {
                    setParallelApproval(e.target.checked);
                    setSequentialApproval(!e.target.checked);
                  }}
                  color="primary"
                />
              </Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                {t("parallelApproval")}
              </Typography>
            </Box>
          </Box>
          {/* ── Right column: toggle cards ── */}

          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            {/* Stage name */}
            <TextField
              placeholder={t("stageName")}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError("name");
              }}
              fullWidth
              size="small"
              error={!!errors.name}
              helperText={errors.name}
            />

            {/* Icon picker */}
            <Box>
              <FormLabel sx={{ display: "block", mb: 1 }}>
                {t("selectIcon")} *
              </FormLabel>
              <IconPicker
                value={selectedIcon || "settings"}
                onChange={setSelectedIcon}
                label=""
                icons={PROCEDURE_DIALOG_ICONS}
              />
            </Box>

            {/* Duration percentage */}
            <TextField
              placeholder={t("stageDurationPercentage")}
              value={durationPercentage}
              onChange={(e) => {
                setDurationPercentage(e.target.value);
                clearError("percentage");
              }}
              fullWidth
              size="small"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              error={!!errors.percentage}
              helperText={errors.percentage}
            />

            {/* Time limit */}
            <Box>
              <FormLabel
                error={!!errors.timeLimit}
                sx={{ display: "block", mb: 1 }}
              >
                {t("timeLimit")} *
              </FormLabel>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <TextField
                  value={deadlineHours}
                  onChange={(e) => {
                    setDeadlineHours(e.target.value);
                    clearError("timeLimit");
                  }}
                  size="small"
                  inputProps={{ min: 0 }}
                  error={!!errors.timeLimit}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption">{tc("hours")}</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  value={deadlineDays}
                  onChange={(e) => {
                    setDeadlineDays(e.target.value);
                    clearError("timeLimit");
                  }}
                  size="small"
                  inputProps={{ min: 0 }}
                  error={!!errors.timeLimit}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Typography variant="caption">{tc("days")}</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
              {errors.timeLimit && (
                <FormHelperText error sx={{ textAlign: "end", mt: 0.5 }}>
                  {errors.timeLimit}
                </FormHelperText>
              )}
            </Box>

            {/* Escalation target */}
            <Box>
              <SearchableSelect
                options={managements.map((m) => ({
                  value: String(m.id),
                  label: m.name,
                }))}
                value={escalationUserId}
                onChange={(val) => setEscalationUserId(String(val))}
                placeholder={t("selectEscalationEntity")}
                searchPlaceholder={tc("searchManagement")}
                noResultsText={tc("noResults")}
                label={t("escalationEntity")}
              />
              <FormHelperText sx={{ textAlign: "end", mt: 0.5 }}>
                {t("escalationEntityHint")}
              </FormHelperText>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5, gap: 1.5 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ flex: 1 }}>
          {tRoot("actions.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim() || (!deadlineHours && !deadlineDays)}
          sx={{ flex: 1 }}
        >
          {tRoot("actions.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
