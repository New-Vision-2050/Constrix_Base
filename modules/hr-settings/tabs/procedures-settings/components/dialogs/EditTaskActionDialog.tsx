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
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useProceduresSettingsTranslations } from "../../hooks/useProceduresSettingsTranslations";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { InternalProcedureSettingsApi } from "@/services/api/hr-settings/internal-procedure-settings";
import type { InternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/types/response";
import {
  alignFormConditionsToOptionKeys,
  mapInternalProcedureToFormValues,
} from "../../utils/mapInternalProcedureToFormValues";
import { normalizeInternalProcedure } from "@/services/api/hr-settings/internal-procedure-settings/normalize";
import { withEmptyOption } from "@/modules/hr-settings/tabs/procedures-settings/utils/selectOptions";
import type { TaskActionFormValues } from "./AddTaskActionDialog";

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
  onSave: (values: TaskActionFormValues) => void | Promise<void>;
}

const defaultValues: TaskActionFormValues = {
  name: "",
  modelId: "",
  formConditions: {},
  appearBefore: "",
  appearAfter: "",
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
  onSave,
}: EditTaskActionDialogProps) {
  const { tTaskAction: t, tc } = useProceduresSettingsTranslations();
  const locale = useLocale();

  const [form, setForm] = useState<TaskActionFormValues>(defaultValues);
  const [nameError, setNameError] = useState("");
  const [modelError, setModelError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFormInitialized, setIsFormInitialized] = useState(false);
  const conditionsAlignedRef = useRef(false);
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

  const modelDisplayLabel = useMemo(() => {
    if (!lockFormModel || !form.modelId) return undefined;
    return (
      modelOptions.find((option) => option.value === form.modelId)?.label ??
      form.modelId
    );
  }, [lockFormModel, form.modelId, modelOptions]);

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

  useEffect(() => {
    if (!open) {
      setForm(defaultValues);
      setNameError("");
      setModelError("");
      setIsFormInitialized(false);
      conditionsAlignedRef.current = false;
      return;
    }

    if (!procedure) return;

    const source = fetchedProcedure ?? normalizeInternalProcedure(procedure);
    const initialValues = mapInternalProcedureToFormValues(source);

    setForm({
      ...defaultValues,
      ...initialValues,
    });
    if (lockFormModel) {
      lockedModelIdRef.current = initialValues.modelId;
    }
    setNameError("");
    setModelError("");
    conditionsAlignedRef.current = false;
    setIsFormInitialized(true);
  }, [open, procedure, fetchedProcedure, lockFormModel]);

  useEffect(() => {
    if (
      !isFormInitialized ||
      isConditionsLoading ||
      !form.modelId ||
      conditionsAlignedRef.current
    ) {
      return;
    }

    setForm((prev) => {
      const alignedConditions = alignFormConditionsToOptionKeys(
        prev.formConditions,
        formConditionOptions.map((condition) => condition.key),
      );

      return {
        ...prev,
        formConditions: alignedConditions,
      };
    });
    conditionsAlignedRef.current = true;
  }, [
    isFormInitialized,
    isConditionsLoading,
    form.modelId,
    formConditionOptions,
  ]);

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

  if (!procedure) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
            />

            <SearchableSelect
              options={modelOptions}
              value={form.modelId}
              onChange={(value) => {
                setForm((prev) => {
                  if (prev.modelId === String(value)) return prev;
                  conditionsAlignedRef.current = false;
                  return {
                    ...prev,
                    modelId: String(value),
                    formConditions: {},
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
                            disabled={isSaving}
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
                            disabled={isSaving}
                          />
                        }
                      />
                    );
                  })}
                </Box>
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
                        disabled={!isFormReady || isSaving}
                      />
                    </Box>
                  )}
                  {!hideAppearAfter && (
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
