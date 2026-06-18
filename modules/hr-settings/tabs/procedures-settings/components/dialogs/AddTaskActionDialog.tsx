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
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import { withEmptyOption } from "@/modules/hr-settings/tabs/procedures-settings/utils/selectOptions";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import type { TaskActionFormValues } from "../../types";

export type { TaskActionFormValues };

/** @deprecated Pass `outerTabs` to `ProceduresSettingsView` instead. */
export const INTERNAL_PROCEDURE_TYPE = "employee_task" as const;
/** @deprecated Pass `outerTabs` to `ProceduresSettingsView` instead. */
export const INTERNAL_PROCEDURES_QUERY_TYPE = "employee_task" as const;

interface AddTaskActionDialogProps {
  open: boolean;
  onClose: () => void;
  procedureType: string;
  existingActions: { id: string; name: string }[];
  excludeFromAppearAfter?: string[];
  excludeFromAppearBefore?: string[];
  onSave: (values: TaskActionFormValues) => void | Promise<void>;
}

const defaultValues: TaskActionFormValues = {
  name: "",
  modelId: "",
  formConditions: {},
  appearBefore: "",
  appearAfter: "",
};

export default function AddTaskActionDialog({
  open,
  onClose,
  procedureType,
  existingActions,
  excludeFromAppearAfter = [],
  excludeFromAppearBefore = [],
  onSave,
}: AddTaskActionDialogProps) {
  const { tTaskAction: t, tc } = useProceduresSettingsTranslations();
  const locale = useLocale();

  const [form, setForm] = useState<TaskActionFormValues>(defaultValues);
  const [nameError, setNameError] = useState("");
  const [modelError, setModelError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(defaultValues);
    setNameError("");
    setModelError("");
  }, [open]);

  const { data: forms = [], isLoading: isFormsLoading } = useQuery({
    queryKey: ["internal_procedure_setting_forms", procedureType, locale],
    queryFn: () =>
      InternalProcedureSettingsApi.getInternalProcedureSettingForms(
        procedureType,
        locale,
      ),
    enabled: open && !!procedureType,
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

  const appearBeforeOptions = useMemo(
    () =>
      withEmptyOption(
        existingActions
          .filter((a) => !excludeFromAppearBefore.includes(a.id))
          .map((action) => ({ value: action.id, label: action.name })),
        t("selectAction"),
      ),
    [existingActions, excludeFromAppearBefore, t],
  );

  const appearAfterOptions = useMemo(
    () =>
      withEmptyOption(
        existingActions
          .filter((a) => !excludeFromAppearAfter.includes(a.id))
          .map((action) => ({ value: action.id, label: action.name })),
        t("selectAction"),
      ),
    [existingActions, excludeFromAppearAfter, t],
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
                options={appearBeforeOptions}
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
                options={appearAfterOptions}
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