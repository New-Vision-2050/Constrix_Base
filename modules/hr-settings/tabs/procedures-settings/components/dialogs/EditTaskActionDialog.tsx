"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import { normalizeInternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import FormConditionsSection from "../FormConditionsSection";
import {
  buildInitialConditionsFromDefinitions,
  mergeConditionsWithDefinitions,
} from "../../utils/conditionFormUtils";
import type { TaskActionFormValues } from "../../types";

interface EditTaskActionDialogProps {
  open: boolean;
  onClose: () => void;
  procedureType: string;
  procedure: InternalProcedure | null;
  existingActions: { id: string; name: string }[];
  lockFormModel?: boolean;
  hideAppearAfter?: boolean;
  hideAppearBefore?: boolean;
  excludeFromAppearAfter?: string[];
  excludeFromAppearBefore?: string[];
  disableIsActiveSwitch?: boolean;
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

export default function EditTaskActionDialog({
  open,
  onClose,
  procedureType,
  procedure,
  existingActions,
  lockFormModel = false,
  hideAppearAfter = false,
  hideAppearBefore = false,
  excludeFromAppearAfter = [],
  excludeFromAppearBefore = [],
  disableIsActiveSwitch = false,
  onSave,
}: EditTaskActionDialogProps) {
  const { tTaskAction: t, tc } = useProceduresSettingsTranslations();
  const locale = useLocale();

  const [form, setForm] = useState<TaskActionFormValues>(defaultValues);
  const [nameError, setNameError] = useState("");
  const [modelError, setModelError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const conditionsSyncedRef = useRef(false);
  const lockedModelIdRef = useRef("");

  const procedureSettingId = procedure?.id;

  const {
    data: fetchedProcedure,
    isLoading: isProcedureLoading,
    isError: isProcedureError,
    isFetching: isProcedureFetching,
  } = useQuery({
    queryKey: ["internal-procedure", procedureSettingId],
    queryFn: () =>
      InternalProcedureSettingsApi.getInternalProcedure(procedureSettingId!),
    enabled: open && !!procedureSettingId,
    placeholderData: procedure ?? undefined,
  });

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

  const modelOptions = useMemo(
    () =>
      forms.map((item) => ({
        value: item.key,
        label: item.name,
      })),
    [forms],
  );

  const modelDisplayLabel = useMemo(() => {
    if (!lockFormModel || !form.modelId) return undefined;
    return (
      modelOptions.find((option) => option.value === form.modelId)?.label ??
      form.modelId
    );
  }, [lockFormModel, form.modelId, modelOptions]);

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

  useEffect(() => {
    if (!open) {
      setForm(defaultValues);
      setNameError("");
      setModelError("");
      setIsFormInitialized(false);
      conditionsSyncedRef.current = false;
      return;
    }

    if (!procedure) return;

    const source = fetchedProcedure ?? normalizeInternalProcedure(procedure);

    setForm((prev) => ({
      ...defaultValues,
      name: source.name,
      modelId: source.form,
      appearBeforeIds: source.appears_before_ids ?? [],
      appearAfterIds: source.appears_after_ids ?? [],
      isActive: source.is_active ?? true,
      conditions: prev.conditions,
    }));

    if (lockFormModel) {
      lockedModelIdRef.current = source.form;
    }
    setNameError("");
    setModelError("");
    conditionsSyncedRef.current = false;
    setIsFormInitialized(true);
  }, [open, procedure, fetchedProcedure, lockFormModel]);

  useEffect(() => {
    if (
      !isFormInitialized ||
      isConditionsLoading ||
      !form.modelId ||
      conditionsSyncedRef.current ||
      conditionDefinitions.length === 0
    ) {
      return;
    }

    const source = fetchedProcedure ?? (procedure ? normalizeInternalProcedure(procedure) : null);

    setForm((prev) => {
      const storedConditions = source?.conditions;
      const initialConditions = buildInitialConditionsFromDefinitions(
        conditionDefinitions,
        storedConditions,
      );

      return {
        ...prev,
        conditions: mergeConditionsWithDefinitions(
          initialConditions,
          conditionDefinitions,
        ),
      };
    });
    conditionsSyncedRef.current = true;
  }, [
    isFormInitialized,
    isConditionsLoading,
    form.modelId,
    conditionDefinitions,
    fetchedProcedure,
    procedure,
  ]);

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
        ...(lockFormModel ? { modelId: lockedModelIdRef.current } : {}),
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const isLoading =
    isProcedureLoading ||
    isProcedureFetching ||
    isFormsLoading ||
    !isFormInitialized ||
    (!!form.modelId && isConditionsLoading);
  const isFormReady =
    isFormInitialized && (!form.modelId || !isConditionsLoading);

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

  if (!procedure) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ textAlign: "start", fontWeight: 700, pb: 1 }}>
        {t("editTitle")}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
        {isProcedureLoading && !isFormInitialized ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : isProcedureError && !procedure ? (
          <Typography variant="body2" color="error">
            {tc("noResults")}
          </Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
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
                disabled={!isFormReady || isSaving}
                error={!!nameError}
                helperText={nameError}
                sx={{ flex: 1, minWidth: 0 }}
              />
              <Switch
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                }
                disabled={!isFormReady || isSaving || disableIsActiveSwitch}
                color="secondary"
                sx={{ mt: 0.5, flexShrink: 0 }}
                inputProps={{ "aria-label": t("isActive") }}
              />
            </Box>

            <SearchableSelect
              options={modelOptions}
              value={form.modelId}
              onChange={(value) => {
                setForm((prev) => {
                  if (prev.modelId === String(value)) return prev;
                  conditionsSyncedRef.current = false;
                  return {
                    ...prev,
                    modelId: String(value),
                    conditions: [],
                  };
                });
                if (modelError) setModelError("");
              }}
              placeholder={
                isFormsLoading ? t("loadingConditions") : t("selectModels")
              }
              noResultsText={tc("noResults")}
              label={t("modelsLabel")}
              required
              disabled={
                !isFormReady || isFormsLoading || isSaving || lockFormModel
              }
              displayLabel={lockFormModel ? modelDisplayLabel : undefined}
              searchable={false}
              error={modelError}
            />

            <Box>
              <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                {t("formConditions")}
              </Typography>
              {!form.modelId ? null : isLoading || !isFormReady ? (
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
                <FormConditionsSection
                  definitions={conditionDefinitions}
                  conditions={form.conditions}
                  onChange={(conditions) =>
                    setForm((prev) => ({ ...prev, conditions }))
                  }
                  disabled={isSaving}
                  defaultGroupLabel={t("formConditions")}
                  labels={conditionTableLabels}
                />
              )}
            </Box>

            {(!hideAppearBefore || !hideAppearAfter) && (
              <Box>
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                  {t("actionOrder")}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                  {!hideAppearBefore && (
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
                        disabled={!isFormReady || isSaving}
                      />
                    </Box>
                  )}
                  {!hideAppearAfter && (
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
                        disabled={!isFormReady || isSaving}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            )}

            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              disabled={!isFormReady || isSaving}
              sx={{ mt: 1 }}
            >
              {t("save")}
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
