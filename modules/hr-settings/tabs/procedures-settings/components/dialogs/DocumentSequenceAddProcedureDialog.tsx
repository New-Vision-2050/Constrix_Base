"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  FormLabel,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import IconPicker from "@/components/shared/icon-picker";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { APP_ICONS } from "@/constants/icons";
import { baseURL } from "@/config/axios-config";
import {
  fetchManagementHierarchyOptions,
  type ManagementHierarchyOption,
} from "@/utils/fetchDropdownOptions";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import { getProcedureSettingsTabTitle } from "../../utils/getProcedureTabTitle";

const DIALOG_ICON_IDS = [
  "person-outline",
  "account-circle",
  "settings",
  "home",
  "alternate-email",
  "notifications",
  "inventory",
] as const;

const DIALOG_ICONS = APP_ICONS.filter((icon) =>
  DIALOG_ICON_IDS.includes(icon.id as (typeof DIALOG_ICON_IDS)[number]),
);

export type DocumentSequenceProcedurePayload = {
  name: string;
  type: string;
  execute_type: string;
  icon: string;
  percentage: number;
  deadline_days: number;
  deadline_hours: number;
  escalation_management_hierarchy_id: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (procedure: DocumentSequenceProcedurePayload) => void;
  currentTabType?: string;
};

/**
 * Project document-sequence dialog.
 * Kept separate from the HR/CRM AddStageDialog so each flow can evolve safely.
 */
export default function DocumentSequenceAddProcedureDialog({
  open,
  onClose,
  onSuccess,
  currentTabType,
}: Props) {
  const { t: tRoot, tStages: t, tc } = useProceduresSettingsTranslations();
  const [name, setName] = useState("");
  const [sequentialApproval, setSequentialApproval] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");
  const [deadlineHours, setDeadlineHours] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [escalationUserId, setEscalationUserId] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    percentage: "",
    timeLimit: "",
  });

  const { data: managements = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["managements", "hierarchy", "management"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=management`,
      ),
  });

  const clearError = (field: keyof typeof errors) =>
    setErrors((current) => ({ ...current, [field]: "" }));

  const reset = () => {
    setName("");
    setSequentialApproval(true);
    setSelectedIcon(null);
    setDurationPercentage("");
    setDeadlineHours("");
    setDeadlineDays("");
    setEscalationUserId("");
    setErrors({ name: "", percentage: "", timeLimit: "" });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const percentage = Number.parseInt(durationPercentage, 10) || 0;
    const nextErrors = {
      name: !name.trim() ? tc("requiredField") : "",
      percentage:
        durationPercentage !== "" && percentage > 100
          ? t("percentageMax")
          : "",
      timeLimit:
        !deadlineHours && !deadlineDays ? tc("enterHoursOrDays") : "",
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    onSuccess({
      name: name.trim(),
      type: currentTabType ?? "",
      execute_type: sequentialApproval ? "sequence" : "parallel",
      icon: selectedIcon || "approval-icon",
      percentage,
      deadline_days: Number.parseInt(deadlineDays, 10) || 0,
      deadline_hours: Number.parseInt(deadlineHours, 10) || 0,
      escalation_management_hierarchy_id: escalationUserId,
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "start", pb: 1 }}>
        {getProcedureSettingsTabTitle(currentTabType, tRoot)}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", gap: 3, pt: 1 }}>
          <Box
            sx={{
              width: 270,
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {[
              {
                sequential: true,
                label: t("sequentialApproval"),
                color: "secondary.main",
              },
              {
                sequential: false,
                label: t("parallelApproval"),
                color: "primary.main",
              },
            ].map((option) => {
              const checked = sequentialApproval === option.sequential;
              return (
                <Box
                  key={String(option.sequential)}
                  sx={{
                    border: 1,
                    borderColor: checked ? option.color : "divider",
                    borderRadius: 2,
                    p: 2,
                    textAlign: "end",
                    bgcolor: "action.hover",
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}
                  >
                    <Switch
                      checked={checked}
                      onChange={() =>
                        setSequentialApproval(option.sequential)
                      }
                      color={option.sequential ? "secondary" : "primary"}
                    />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {option.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <TextField
              placeholder={t("stageName")}
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                clearError("name");
              }}
              fullWidth
              size="small"
              error={!!errors.name}
              helperText={errors.name}
            />

            <Box>
              <FormLabel sx={{ display: "block", mb: 1 }}>
                {t("selectIcon")} *
              </FormLabel>
              <IconPicker
                value={selectedIcon || "settings"}
                onChange={setSelectedIcon}
                label=""
                icons={DIALOG_ICONS}
              />
            </Box>

            <TextField
              placeholder={t("stageDurationPercentage")}
              value={durationPercentage}
              onChange={(event) => {
                setDurationPercentage(event.target.value);
                clearError("percentage");
              }}
              fullWidth
              size="small"
              type="number"
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              error={!!errors.percentage}
              helperText={errors.percentage}
            />

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
                  onChange={(event) => {
                    setDeadlineHours(event.target.value);
                    clearError("timeLimit");
                  }}
                  size="small"
                  type="number"
                  error={!!errors.timeLimit}
                  slotProps={{
                    htmlInput: { min: 0 },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption">
                            {tc("hours")}
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  value={deadlineDays}
                  onChange={(event) => {
                    setDeadlineDays(event.target.value);
                    clearError("timeLimit");
                  }}
                  size="small"
                  type="number"
                  error={!!errors.timeLimit}
                  slotProps={{
                    htmlInput: { min: 0 },
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Typography variant="caption">
                            {tc("days")}
                          </Typography>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{ flex: 1 }}
                />
              </Box>
              {errors.timeLimit ? (
                <FormHelperText error sx={{ textAlign: "end", mt: 0.5 }}>
                  {errors.timeLimit}
                </FormHelperText>
              ) : null}
            </Box>

            <Box>
              <SearchableSelect
                options={managements.map((management) => ({
                  value: String(management.id),
                  label: management.name,
                }))}
                value={escalationUserId}
                onChange={(value) => setEscalationUserId(String(value))}
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
