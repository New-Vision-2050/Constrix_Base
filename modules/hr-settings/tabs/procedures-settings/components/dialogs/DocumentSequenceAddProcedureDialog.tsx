"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormLabel,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import IconPicker from "@/components/shared/icon-picker";
import { APP_ICONS } from "@/constants/icons";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import { getProcedureSettingsTabTitle } from "../../utils/getProcedureTabTitle";
import { distributePercentages } from "../../utils/distributePercentages";

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
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (procedure: DocumentSequenceProcedurePayload) => void;
  currentTabType?: string;
  existingProcedures: { id: string; percentage: number }[];
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
  existingProcedures,
}: Props) {
  const { t: tRoot, tStages: t, tc } = useProceduresSettingsTranslations();
  const [name, setName] = useState("");
  const [sequentialApproval, setSequentialApproval] = useState(true);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");
  const [deadlineHours] = useState("0");
  const [deadlineDays] = useState("0");
  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    if (!open) return;
    const total = existingProcedures.length + 1;
    const percentages = distributePercentages(total);
    setDurationPercentage(String(percentages[0] ?? 100));
  }, [open, existingProcedures]);

  const clearError = (field: keyof typeof errors) =>
    setErrors((current) => ({ ...current, [field]: "" }));

  const reset = () => {
    setName("");
    setSequentialApproval(true);
    setSelectedIcon(null);
    setDurationPercentage("");
    setErrors({ name: "" });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    const percentage = Number.parseInt(durationPercentage, 10) || 0;
    const nextErrors = {
      name: !name.trim() ? tc("requiredField") : "",
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
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "start", pb: 1 }}>
        {getProcedureSettingsTabTitle(currentTabType ?? "", tRoot)}
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
              fullWidth
              size="small"
              type="number"
              slotProps={{ htmlInput: { min: 0, max: 100 } }}
              disabled
            />

            <Box>
              <FormLabel sx={{ display: "block", mb: 1 }}>
                {t("timeLimit")}
              </FormLabel>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <TextField
                  value={deadlineHours}
                  size="small"
                  type="number"
                  disabled
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
                  size="small"
                  type="number"
                  disabled
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
