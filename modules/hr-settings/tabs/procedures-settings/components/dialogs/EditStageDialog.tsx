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
import { useState, useEffect, useMemo } from "react";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import IconPicker from "@/components/shared/icon-picker";
import { APP_ICONS } from "@/constants/icons";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import {
  Stage,
  ProcedureStep,
} from "@/services/api/crm-settings/procedure-settings/types/response";
import { useToast } from "@/modules/table/hooks/use-toast";
import { getProcedureEditTabTitle } from "../../utils/getProcedureTabTitle";
import { useProceduresSettings } from "../../context/ProceduresSettingsContext";

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
  procedureSteps: ProcedureStep[];
}

export default function EditStageDialog({
  open,
  onClose,
  procedure,
  onSuccess,
  onDeleted,
  procedureSteps,
}: EditStageDialogProps) {
  const { t: tRoot, tStages: t, tc } = useProceduresSettingsTranslations();
  const { toast } = useToast();
  const { projectId } = useProceduresSettings();

  const [name, setName] = useState("");
  const [sequentialApproval, setSequentialApproval] = useState(true);
  const [parallelApproval, setParallelApproval] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [durationPercentage, setDurationPercentage] = useState("");

  const [errors, setErrors] = useState<{
    name: string;
  }>({ name: "" });

  const { totalDays, totalHours } = useMemo(() => {
    const total = procedureSteps.reduce((sum, step) => {
      return (
        sum +
        (step.approval_within_days || 0) * 24 +
        (step.approval_within_hours || 0)
      );
    }, 0);
    return {
      totalDays: Math.floor(total / 24),
      totalHours: total % 24,
    };
  }, [procedureSteps]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open || !procedure) return;
    setName(procedure.name || "");
    const isParallel = procedure.execute_type === "parallel";
    setSequentialApproval(!isParallel);
    setParallelApproval(isParallel);
    setSelectedIcon(procedure.icon || null);
    setDurationPercentage(
      procedure.percentage != null ? String(procedure.percentage) : "",
    );
    setErrors({ name: "" });
  }, [open, procedure]);

  const clearError = (field: keyof typeof errors) =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = async () => {
    if (!procedure) return;

    const percentageValue = parseInt(durationPercentage, 10) || 0;
    const newErrors = {
      name: !name.trim() ? tc("requiredField") : "",
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setIsSubmitting(true);
    try {
      await ProcedureSettingsApi.updateStage(procedure.id, {
        name: name.trim(),
        execute_type: sequentialApproval ? "sequence" : "parallel",
        icon: selectedIcon || procedure.icon || "approval-icon",
        percentage: percentageValue,
        type: procedure.type,
        deadline_days: totalDays,
        deadline_hours: totalHours,
        ...(projectId ? { project_id: projectId } : {}),
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
    setSequentialApproval(true);
    setParallelApproval(false);
    setSelectedIcon(null);
    setDurationPercentage("");
    setErrors({ name: "" });
    onClose();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // Get tab type from procedure
  const currentTabType = procedure?.type || "";

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "start", pb: 1 }}>
        {getProcedureEditTabTitle(
          currentTabType,
          tRoot,
          t("editStage"),
        )}
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", gap: 3, pt: 1 }}>
          {/* \u2500\u2500 Toggle cards column \u2500\u2500 */}
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
              <Typography variant="caption" color="text.secondary">
                {t("sequentialApprovalHint")}
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
              <Typography variant="caption" color="text.secondary">
                {t("parallelApprovalHint")}
              </Typography>
            </Box>
          </Box>

          {/* \u2500\u2500 Form fields column \u2500\u2500 */}
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
                  value={totalHours}
                  size="small"
                  type="number"
                  inputProps={{ min: 0, style: { textAlign: "end" } }}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography variant="caption">{tc("hours")}</Typography>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ flex: 1 }}
                />
                <TextField
                  value={totalDays}
                  size="small"
                  type="number"
                  inputProps={{ min: 0, style: { textAlign: "end" } }}
                  disabled
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
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
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{ flex: 1 }}
        >
          {tRoot("actions.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting || !name.trim()}
          sx={{ flex: 1 }}
        >
          {tRoot("actions.save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
