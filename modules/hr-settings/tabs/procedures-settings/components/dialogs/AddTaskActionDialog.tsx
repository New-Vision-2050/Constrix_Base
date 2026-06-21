"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import FormConditionsTable from "../FormConditionsTable";
import { buildInitialConditionsFromDefinitions } from "../../utils/conditionFormUtils";
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
  conditions: [],
  appearBeforeIds: [],
  appearAfterIds: [],
  isActive: true,
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
  const conditionsModelRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) {
      conditionsModelRef.current = null;
      return;
    }
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

  const { data: conditionDefinitions = [], isLoading: isConditionsLoading } =
    useQuery({
      queryKey: ["procedure-settings-forms-conditions", form.modelId, locale],
      queryFn: () =>
        InternalProcedureSettingsApi.getFormsConditions(form.modelId, locale),
      enabled: open && !!form.modelId,
    });

  useEffect(() => {
    if (!form.modelId) {
      conditionsModelRef.current = null;
      return;
    }
    if (isConditionsLoading || conditionDefinitions.length === 0) return;
    if (conditionsModelRef.current === form.modelId) return;

    conditionsModelRef.current = form.modelId;
    setForm((prev) => ({
      ...prev,
      conditions: buildInitialConditionsFromDefinitions(conditionDefinitions),
    }));
  }, [form.modelId, conditionDefinitions, isConditionsLoading]);

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
      existingActions
        .filter((a) => !excludeFromAppearBefore.includes(a.id))
        .map((action) => ({ value: action.id, label: action.name })),
    [existingActions, excludeFromAppearBefore],
  );

  const appearAfterOptions = useMemo(
    () =>
      existingActions
        .filter((a) => !excludeFromAppearAfter.includes(a.id))
        .map((action) => ({ value: action.id, label: action.name })),
    [existingActions, excludeFromAppearAfter],
  );

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

  const conditionTableLabels = useMemo(
    () => ({
      sortOrder: t("conditionsTable.sortOrder"),
      status: t("conditionsTable.status"),
      condition: t("conditionsTable.condition"),
      conditionType: t("conditionsTable.conditionType"),
      settings: t("conditionsTable.settings"),
    }),
    [t],
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
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
            conditionsModelRef.current = null;
            setForm((prev) => ({
              ...prev,
              modelId: String(value),
              conditions: [],
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
          ) : conditionDefinitions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("noConditions")}
            </Typography>
          ) : (
            <FormConditionsTable
              definitions={conditionDefinitions}
              conditions={form.conditions}
              onChange={(conditions) =>
                setForm((prev) => ({ ...prev, conditions }))
              }
              disabled={isSaving}
              labels={conditionTableLabels}
            />
          )}
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
            {t("actionOrder")}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <SearchableSelect
                multiple
                options={appearBeforeOptions}
                value={form.appearBeforeIds}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    appearBeforeIds: value.map(String),
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
                multiple
                options={appearAfterOptions}
                value={form.appearAfterIds}
                onChange={(value) =>
                  setForm((prev) => ({
                    ...prev,
                    appearAfterIds: value.map(String),
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
