"use client";

import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { withEmptyOption } from "@/modules/hr-settings/tabs/procedures-settings/utils/selectOptions";

const MODEL_OPTION_DEFS = [
  { id: "task_time_setting", labelKey: "taskTimeSetting" as const },
  { id: "cancel_task", labelKey: "cancelTask" as const },
  { id: "confirm_location", labelKey: "confirmLocation" as const },
  { id: "confirm_task_location", labelKey: "confirmTaskLocation" as const },
  { id: "select_other_employee", labelKey: "selectOtherEmployee" as const },
  { id: "send_and_approve", labelKey: "sendAndApprove" as const },
] as const;

const FORM_CONDITION_DEFS = [
  { id: "employee_on_duty", labelKey: "employeeOnDuty" as const },
  { id: "employee_off_duty", labelKey: "employeeOffDuty" as const },
  { id: "works_all_branches", labelKey: "worksAllBranches" as const },
  { id: "works_all_branches_alt", labelKey: "worksAllBranches" as const },
  { id: "task_duration", labelKey: "taskDuration" as const },
] as const;

export interface TaskActionFormValues {
  name: string;
  modelId: string;
  formConditions: string[];
  orderActionId: string;
}

interface AddTaskActionDialogProps {
  open: boolean;
  mode: "add" | "edit";
  onClose: () => void;
  existingActions: { id: string; name: string }[];
  initialValues?: Partial<TaskActionFormValues>;
  onSave: (values: TaskActionFormValues) => void;
}

const defaultValues: TaskActionFormValues = {
  name: "",
  modelId: "",
  formConditions: ["employee_on_duty"],
  orderActionId: "",
};

export default function AddTaskActionDialog({
  open,
  mode,
  onClose,
  existingActions,
  initialValues,
  onSave,
}: AddTaskActionDialogProps) {
  const t = useTranslations("hr-settings.proceduresSettings.taskActionDialog");
  const tc = useTranslations("hr-settings.proceduresSettings.common");

  const [form, setForm] = useState<TaskActionFormValues>(defaultValues);
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (!open) return;
    setForm({
      ...defaultValues,
      ...initialValues,
      formConditions: initialValues?.formConditions ?? ["employee_on_duty"],
    });
    setNameError("");
  }, [open, initialValues]);

  const modelOptions = useMemo(
    () =>
      MODEL_OPTION_DEFS.map((item) => ({
        value: item.id,
        label: t(`models.${item.labelKey}`),
      })),
    [t],
  );

  const actionOrderOptions = useMemo(
    () =>
      withEmptyOption(
        existingActions.map((action) => ({
          value: action.id,
          label: action.name,
        })),
        t("selectAction"),
      ),
    [existingActions, t],
  );

  const toggleFormCondition = (conditionId: string) => {
    setForm((prev) => ({
      ...prev,
      formConditions: prev.formConditions.includes(conditionId)
        ? prev.formConditions.filter((id) => id !== conditionId)
        : [...prev.formConditions, conditionId],
    }));
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setNameError(tc("requiredField"));
      return;
    }
    onSave({
      ...form,
      name: form.name.trim(),
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "start", fontWeight: 700, pb: 1 }}>
        {t("title")}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
        <TextField
          label={t("actionName")}
          placeholder={t("actionNamePlaceholder")}
          value={form.name}
          onChange={(e) => {
            setForm((prev) => ({ ...prev, name: e.target.value }));
            if (nameError) setNameError("");
          }}
          fullWidth
          size="small"
          required
          error={!!nameError}
          helperText={nameError}
        />

        <SearchableSelect
          options={modelOptions}
          value={form.modelId}
          onChange={(value) =>
            setForm((prev) => ({ ...prev, modelId: String(value) }))
          }
          placeholder={t("selectModels")}
          searchPlaceholder={tc("search")}
          noResultsText={tc("noResults")}
          label={t("modelsLabel")}
          required
        />

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            {t("formConditions")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {FORM_CONDITION_DEFS.map((condition) => (
              <FormControlLabel
                key={condition.id}
                labelPlacement="start"
                sx={{
                  m: 0,
                  width: "100%",
                  justifyContent: "space-between",
                }}
                label={
                  <Typography variant="body2">
                    {t(`conditions.${condition.labelKey}`)}
                  </Typography>
                }
                control={
                  <Checkbox
                    checked={form.formConditions.includes(condition.id)}
                    onChange={() => toggleFormCondition(condition.id)}
                    size="small"
                  />
                }
              />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            {t("actionOrder")}
          </Typography>
          <SearchableSelect
            options={actionOrderOptions}
            value={form.orderActionId}
            onChange={(value) =>
              setForm((prev) => ({
                ...prev,
                orderActionId: String(value),
              }))
            }
            placeholder={t("selectAction")}
            searchPlaceholder={tc("search")}
            noResultsText={tc("noResults")}
            label={t("appearsBeforeAfter")}
            required
          />
        </Box>

        <Button variant="contained" fullWidth onClick={handleSave} sx={{ mt: 1 }}>
          {t("save")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
