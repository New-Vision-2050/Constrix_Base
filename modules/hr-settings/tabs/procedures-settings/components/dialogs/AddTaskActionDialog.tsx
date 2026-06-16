"use client";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import { withEmptyOption } from "@/modules/hr-settings/tabs/procedures-settings/utils/selectOptions";

export const INTERNAL_PROCEDURE_TYPE = "employee_task" as const;
export const INTERNAL_PROCEDURES_QUERY_TYPE = "employee_task" as const;

export interface TaskActionFormValues {
  name: string;
  modelId: string;
  formConditions: Record<string, boolean | number>;
  appearBefore: string;
  appearAfter: string;
}

interface AddTaskActionDialogProps {
  open: boolean;
  mode: "add" | "edit";
  onClose: () => void;
  existingActions: { id: string; name: string }[];
  initialValues?: Partial<TaskActionFormValues>;
  onSave: (values: TaskActionFormValues) => void | Promise<void>;
}

const defaultValues: TaskActionFormValues = {
  name: "",
  modelId: "",
  formConditions: {},
  appearBefore: "",
  appearAfter: "",
};

function normalizeFormConditions(
  value: string[] | Record<string, boolean | number> | undefined,
): Record<string, boolean | number> {
  if (!value) return {};
  if (Array.isArray(value)) {
    return Object.fromEntries(value.map((key) => [key, true]));
  }
  return value;
}

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
  const locale = useLocale();

  const [form, setForm] = useState<TaskActionFormValues>(defaultValues);
  const [nameError, setNameError] = useState("");
  const [modelError, setModelError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      ...defaultValues,
      ...initialValues,
      formConditions: normalizeFormConditions(initialValues?.formConditions),
    });
    setNameError("");
    setModelError("");
  }, [open, initialValues]);

  const { data: forms = [], isLoading: isFormsLoading } = useQuery({
    queryKey: ["internal_procedure_setting_forms", locale],
    queryFn: () =>
      InternalProcedureSettingsApi.getInternalProcedureSettingForms(locale),
    enabled: open,
  });

  const { data: formConditionOptions = [], isLoading: isConditionsLoading } =
    useQuery({
      queryKey: ["forms_conditions", form.modelId, locale],
      queryFn: () =>
        InternalProcedureSettingsApi.getFormsConditions(form.modelId, locale),
      enabled: open && !!form.modelId,
    });

  const modelOptions = useMemo(
    () =>
      forms.map((item) => ({
        value: item.key,
        label: item.name,
      })),
    [forms],
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

  const toggleBoolFormCondition = (conditionKey: string) => {
    setForm((prev) => {
      const next = { ...prev.formConditions };
      if (next[conditionKey]) {
        delete next[conditionKey];
      } else {
        next[conditionKey] = true;
      }
      return { ...prev, formConditions: next };
    });
  };

  const setIntFormCondition = (conditionKey: string, rawValue: string) => {
    setForm((prev) => {
      const next = { ...prev.formConditions };
      if (rawValue === "") {
        delete next[conditionKey];
      } else {
        const parsed = parseInt(rawValue, 10);
        if (!Number.isNaN(parsed)) {
          next[conditionKey] = parsed;
        }
      }
      return { ...prev, formConditions: next };
    });
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setNameError(tc("requiredField"));
      return;
    }
    if (!form.modelId) {
      setModelError(tc("requiredField"));
      return;
    }
    setIsSaving(true);
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: "start", fontWeight: 700, pb: 1 }}>
        {mode === "edit" ? t("editTitle") : t("title")}
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
          disabled={isSaving}
          error={!!nameError}
          helperText={nameError}
        />

        <SearchableSelect
          options={modelOptions}
          value={form.modelId}
          onChange={(value) => {
            setForm((prev) => ({
              ...prev,
              modelId: String(value),
              formConditions: {},
            }));
            if (modelError) setModelError("");
          }}
          placeholder={
            isFormsLoading ? t("loadingConditions") : t("selectModels")
          }
          noResultsText={tc("noResults")}
          label={t("modelsLabel")}
          required
          disabled={isFormsLoading || isSaving}
          searchable={false}
          error={modelError}
        />

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            {t("formConditions")}
          </Typography>
          {!form.modelId ? null : isConditionsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
              <Typography variant="body2" sx={{ ml: 1.5 }}>
                {t("loadingConditions")}
              </Typography>
            </Box>
          ) : formConditionOptions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("noConditions")}
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              {formConditionOptions.map((condition) => {
                const conditionKey = condition.key;
                const isIntCondition = condition.type === "int";

                if (isIntCondition) {
                  const intValue = form.formConditions[conditionKey];
                  return (
                    <Box
                      key={conditionKey}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                      }}
                    >
                      <Typography variant="body2">{condition.name}</Typography>
                      <TextField
                        type="number"
                        size="small"
                        value={intValue ?? ""}
                        onChange={(e) =>
                          setIntFormCondition(conditionKey, e.target.value)
                        }
                        inputProps={{ min: 0, step: 1 }}
                        sx={{ width: 120 }}
                      />
                    </Box>
                  );
                }

                return (
                  <FormControlLabel
                    key={conditionKey}
                    labelPlacement="start"
                    sx={{
                      m: 0,
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                    label={
                      <Typography variant="body2">{condition.name}</Typography>
                    }
                    control={
                      <Checkbox
                        checked={!!form.formConditions[conditionKey]}
                        onChange={() => toggleBoolFormCondition(conditionKey)}
                        size="small"
                      />
                    }
                  />
                );
              })}
            </Box>
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            {t("actionOrder")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <SearchableSelect
                options={actionOrderOptions}
                value={form.appearBefore}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    appearBefore: String(value),
                  }))
                }
                placeholder={t("selectAction")}
                searchPlaceholder={tc("search")}
                noResultsText={tc("noResults")}
                label={t("appearBefore")}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <SearchableSelect
                options={actionOrderOptions}
                value={form.appearAfter}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    appearAfter: String(value),
                  }))
                }
                placeholder={t("selectAction")}
                searchPlaceholder={tc("search")}
                noResultsText={tc("noResults")}
                label={t("appearAfter")}
              />
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleSave}
          disabled={isSaving}
          sx={{ mt: 1 }}
        >
          {t("save")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}