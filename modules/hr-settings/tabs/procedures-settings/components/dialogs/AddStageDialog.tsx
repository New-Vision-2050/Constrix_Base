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
  InputAdornment,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import IconPicker from "@/components/shared/icon-picker";
import { APP_ICONS } from "@/constants/icons";
import { getProcedureSettingsTabTitle } from "../../utils/getProcedureTabTitle";
import { distributePercentages } from "../../utils/distributePercentages";

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
  }) => void;
  currentTabType?: string;
  existingProcedures: { id: string; percentage: number }[];
}

export default function AddStageDialog({
  open,
  onClose,
  onSuccess,
  currentTabType,
  existingProcedures,
}: AddStageDialogProps) {
  const { t: tRoot, tStages: t, tc } = useProceduresSettingsTranslations();

  const [name, setName] = useState("");
  const [sequentialApproval, setSequentialApproval] = useState(true);
  const [parallelApproval, setParallelApproval] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");
  const [deadlineHours] = useState("0");
  const [deadlineDays] = useState("0");

  const [errors, setErrors] = useState<{
    name: string;
  }>({ name: "" });

  useEffect(() => {
    if (!open) return;
    const total = existingProcedures.length + 1;
    const percentages = distributePercentages(total);
    setDurationPercentage(String(percentages[0] ?? 100));
  }, [open, existingProcedures]);

  const handleSubmit = () => {
    const percentageValue = parseInt(durationPercentage) || 0;
    const newErrors = {
      name: !name.trim() ? tc("requiredField") : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    onSuccess({
      name: name.trim(),
      type: currentTabType ?? "",
      execute_type: sequentialApproval ? "sequence" : "parallel",
      icon: selectedIcon || "approval-icon",
      percentage: percentageValue,
      deadline_days: parseInt(deadlineDays) || 0,
      deadline_hours: parseInt(deadlineHours) || 0,
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
    setErrors({ name: "" });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "start", pb: 1 }}>
        {getProcedureSettingsTabTitle(currentTabType ?? "", tRoot)}
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
              fullWidth
              size="small"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              disabled
            />

            {/* Time limit */}
            <Box>
              <FormLabel sx={{ display: "block", mb: 1 }}>
                {t("timeLimit")}
              </FormLabel>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <TextField
                  value={deadlineHours}
                  size="small"
                  inputProps={{ min: 0 }}
                  disabled
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
                  size="small"
                  inputProps={{ min: 0 }}
                  disabled
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
          disabled={!name.trim()}
          sx={{ flex: 1 }}
        >
          {tRoot("actions.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
