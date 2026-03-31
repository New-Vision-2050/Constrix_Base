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
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import IconPicker from "@/components/shared/icon-picker";
import { APP_ICONS } from "@/constants/icons";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import { Stage } from "@/services/api/crm-settings/procedure-settings/types/response";
import { useToast } from "@/modules/table/hooks/use-toast";

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

interface EditStageDialogProps {
  open: boolean;
  onClose: () => void;
  procedure: Stage | null;
  onSuccess: () => void;
  /** Called after the procedure is deleted (before onSuccess). */
  onDeleted?: (procedureId: string) => void;
}

export default function EditStageDialog({
  open,
  onClose,
  procedure,
  onSuccess,
  onDeleted,
}: EditStageDialogProps) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings.stages");
  const tRoot = useTranslations("CRMSettingsModule.proceduresSettings");
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [executionType, setExecutionType] = useState("sequence");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");
  const [percentageError, setPercentageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !procedure) return;
    setName(procedure.name || "");
    setExecutionType(
      procedure.execute_type === "parallel" ? "parallel" : "sequence",
    );
    setSelectedIcon(procedure.icon || null);
    setDurationPercentage(
      procedure.percentage != null ? String(procedure.percentage) : "",
    );
    setPercentageError("");
  }, [open, procedure]);

  const handleSubmit = async () => {
    if (!name.trim() || !procedure) return;

    const percentageValue = parseInt(durationPercentage, 10) || 0;
    if (percentageValue > 100) {
      setPercentageError(t("percentageMax"));
      return;
    }
    setPercentageError("");

    setIsSubmitting(true);
    try {
      await ProcedureSettingsApi.updateStage(procedure.id, {
        name: name.trim(),
        execute_type: executionType,
        icon: selectedIcon || procedure.icon,
        percentage: percentageValue,
        type: procedure.type,
      });
      toast({
        title: tRoot("actions.edit"),
        description: tRoot("messages.procedureUpdated"),
        variant: "default",
      });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error updating procedure:", error);
      toast({
        title: tRoot("actions.edit"),
        description: tRoot("messages.error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setExecutionType("sequence");
    setSelectedIcon(null);
    setDurationPercentage("");
    setPercentageError("");
    onClose();
  };

  const handleDelete = async () => {
    if (!procedure) return;
    setIsSubmitting(true);
    try {
      await ProcedureSettingsApi.deleteStage(procedure.id);
      onDeleted?.(procedure.id);
      toast({
        title: tRoot("actions.delete"),
        description: tRoot("messages.procedureDeleted"),
        variant: "default",
      });
      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error deleting procedure:", error);
      toast({
        title: tRoot("actions.delete"),
        description: tRoot("messages.error"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("editStage")}</DialogTitle>
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
        {/* <Button onClick={handleDelete} color="error" disabled={isSubmitting}>
          {t("delete")}
        </Button> */}
        <Box>
          <Button onClick={handleClose} disabled={isSubmitting} sx={{ mr: 1 }}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting || !name.trim()}
          >
            {t("save")}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
