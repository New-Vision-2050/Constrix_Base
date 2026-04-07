"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useTranslations } from "next-intl";
import IconPicker from "@/components/shared/icon-picker";
import { APP_ICONS } from "@/constants/icons";

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
  }) => void;
  currentTabType?: string;
}

export default function AddStageDialog({
  open,
  onClose,
  onSuccess,
  currentTabType = "client_request",
}: AddStageDialogProps) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings.stages");

  const [name, setName] = useState("");
  const [executionType, setExecutionType] = useState("sequence");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");
  const [percentageError, setPercentageError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;

    const percentageValue = parseInt(durationPercentage) || 0;
    if (percentageValue > 100) {
      setPercentageError("يجب ألا يكون حقل percentage أكبر من 100.");
      return;
    }

    setPercentageError("");
    onSuccess({
      name: name.trim(),
      type: currentTabType,
      execute_type: executionType,
      icon: selectedIcon || "approval-icon",
      percentage: percentageValue,
    });
    handleClose();
  };

  const handleClose = () => {
    setName("");
    setExecutionType("sequence");
    setSelectedIcon(null);
    setDurationPercentage("");
    setPercentageError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>اضافة اسم الاجراء</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <TextField
            label={t("stageName")}
            placeholder={t("enterStageName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            size="small"
          />

          <FormControl>
            <FormLabel>{t("executeProjectStages")}</FormLabel>
            <RadioGroup
              row
              value={executionType}
              onChange={(e) => setExecutionType(e.target.value)}
            >
              <FormControlLabel
                value="sequence"
                control={<Radio />}
                label={t("sequential")}
              />
              <FormControlLabel
                value="parallel"
                control={<Radio />}
                label={t("parallel")}
              />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <FormLabel>{t("selectIcon")}</FormLabel>
            <Box sx={{ mt: 1 }}>
              <IconPicker
                value={selectedIcon || "settings"}
                onChange={setSelectedIcon}
                label=""
                icons={PROCEDURE_DIALOG_ICONS}
              />
            </Box>
          </FormControl>

          <TextField
            label={t("stageDurationPercentage")}
            value={durationPercentage}
            onChange={(e) => {
              setDurationPercentage(e.target.value);
              if (percentageError) setPercentageError("");
            }}
            fullWidth
            size="small"
            type="number"
            inputProps={{ min: 0, max: 100 }}
            error={!!percentageError}
            helperText={percentageError}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{t("cancel")}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!name.trim()}
        >
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
