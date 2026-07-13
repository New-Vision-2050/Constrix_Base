"use client";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { useToast } from "@/modules/table/hooks/use-toast";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import type { ProcedureStep } from "@/services/api/crm-settings/procedure-settings/types/response";
import type { CreateStepArgs } from "@/services/api/crm-settings/procedure-settings/types/args";
import {
  fetchManagementHierarchyOptions,
  type ManagementHierarchyOption,
} from "@/utils/fetchDropdownOptions";
import { baseURL } from "@/config/axios-config";
import { useProceduresSettingsTranslations } from "../hooks/useProceduresSettingsTranslations";

interface DocumentStageCardProps {
  procedureSettingId: string;
  serverStep: ProcedureStep | null;
  stepIndex?: number;
  onSaved: () => void;
  onDelete: () => void;
  onCopy?: () => void;
}

type DocumentStageForm = {
  procedureName: string;
  actionTakerType: string;
  procedureOrder: string;
  orgRule: string;
  orgTemplate: string;
  model: string;
  description: string;
  notifyMobileApp: boolean;
  notifyWorkAlert: boolean;
  notifySystemEmail: boolean;
  notifyWhatsapp: boolean;
  escalateAfter: string;
  escalateUnit: string;
  escalateTo: string;
  escalationEntity: string;
};

const defaultValues: DocumentStageForm = {
  procedureName: "",
  actionTakerType: "",
  procedureOrder: "1",
  orgRule: "",
  orgTemplate: "",
  model: "",
  description: "",
  notifyMobileApp: false,
  notifyWorkAlert: false,
  notifySystemEmail: false,
  notifyWhatsapp: false,
  escalateAfter: "1",
  escalateUnit: "day",
  escalateTo: "responsible_engineer",
  escalationEntity: "",
};

function RequiredLabel({ label }: { label: string }) {
  return (
    <Box component="span">
      {label}
      <Box component="span" sx={{ color: "error.main", ms: 0.25 }}>
        *
      </Box>
    </Box>
  );
}

export default function DocumentStageCard({
  procedureSettingId,
  serverStep,
  stepIndex = 1,
  onSaved,
  onDelete,
  onCopy,
}: DocumentStageCardProps) {
  const { t, tc, tStepCard: ts } = useProceduresSettingsTranslations();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(!serverStep);
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, reset, watch } = useForm<DocumentStageForm>({
    defaultValues: {
      ...defaultValues,
      procedureOrder: String(stepIndex),
    },
  });

  const fieldsDisabled = !isEditing || isSaving;

  const { data: managements = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["managements", "hierarchy", "management", "document-stage"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=management`,
      ),
  });

  useEffect(() => {
    if (!serverStep) {
      reset({
        ...defaultValues,
        procedureOrder: String(stepIndex),
        procedureName: "",
      });
      setIsEditing(true);
      return;
    }

    reset({
      procedureName: serverStep.name ?? "",
      actionTakerType: serverStep.action_taker_type ?? "",
      procedureOrder: String(stepIndex),
      orgRule: serverStep.is_approve
        ? "approve"
        : serverStep.is_view_only
          ? "view_only"
          : serverStep.is_return_with_notes
            ? "return_with_notes"
            : "approve",
      orgTemplate: serverStep.forms || "approve",
      model: serverStep.forms || "",
      description: "",
      notifyMobileApp: Boolean(serverStep.notify_by_push),
      notifyWorkAlert: Boolean(serverStep.notify_by_sms),
      notifySystemEmail: Boolean(serverStep.notify_by_email),
      notifyWhatsapp: Boolean(serverStep.notify_by_whatsapp),
      escalateAfter: String(serverStep.approval_within_days || 1),
      escalateUnit: "day",
      escalateTo: "responsible_engineer",
      escalationEntity: serverStep.escalation_management_hierarchy_id ?? "",
    });
    setIsEditing(false);
  }, [serverStep, stepIndex, reset]);

  const actionTakerOptions = useMemo(
    () => [
      {
        value: "specific_user",
        label: ts("options.actionTakerType.specificUser"),
      },
      {
        value: "management_hierarchy",
        label: ts("options.actionTakerType.managementHierarchy"),
      },
      {
        value: "assigned_user",
        label: ts("options.actionTakerType.assignedUser"),
      },
      { value: "himself", label: ts("options.actionTakerType.himself") },
    ],
    [ts],
  );

  const orgRuleOptions = useMemo(
    () => [
      { value: "approve", label: ts("options.orgBase.approve") },
      { value: "view_only", label: ts("options.orgBase.viewOnly") },
      {
        value: "return_with_notes",
        label: ts("options.orgBase.returnWithNotes"),
      },
      { value: "approve_timed", label: ts("options.orgBase.approveTimed") },
    ],
    [ts],
  );

  const orgTemplateOptions = useMemo(
    () => [
      { value: "approve", label: ts("options.orgTemplate.approve") },
      {
        value: "accept",
        label: ts("options.orgTemplate.accreditationForm"),
      },
    ],
    [ts],
  );

  const escalationEntityOptions = useMemo(
    () =>
      managements.map((item) => ({
        value: String(item.id),
        label: item.name,
      })),
    [managements],
  );

  const procedureNameValue = watch("procedureName");
  const procedureNameOptions = useMemo(() => {
    const base = [
      { value: "confirm_receipt", label: "تأكيد استلام" },
      { value: "initial_review", label: "مراجعة اولية" },
      { value: "final_approval", label: "اعتماد نهائي" },
    ];
    if (
      procedureNameValue &&
      !base.some(
        (o) =>
          o.value === procedureNameValue || o.label === procedureNameValue,
      )
    ) {
      return [
        { value: procedureNameValue, label: procedureNameValue },
        ...base,
      ];
    }
    return base;
  }, [procedureNameValue]);

  const onSubmit = async (data: DocumentStageForm) => {
    if (!data.procedureName.trim() || !data.actionTakerType || !data.orgRule) {
      toast({
        title: t("actions.save"),
        description: tc("requiredField"),
        variant: "destructive",
      });
      return;
    }

    const body: CreateStepArgs = {
      name: data.procedureName.trim(),
      action_taker_type: data.actionTakerType,
      action_taker_user_ids: [],
      concerned_management_hierarchy_ids: [],
      is_accept: data.orgTemplate === "accept",
      is_approve: data.orgRule === "approve" || data.orgRule === "approve_timed",
      is_view_only: data.orgRule === "view_only",
      is_return_with_notes: data.orgRule === "return_with_notes",
      requires_approval_within_period: data.orgRule === "approve_timed",
      forms: data.orgTemplate || data.model || "approve",
      approval_within_days: Number(data.escalateAfter) || 0,
      approval_within_hours: 0,
      notify_by_email: data.notifySystemEmail,
      notify_by_whatsapp: data.notifyWhatsapp,
      notify_by_sms: data.notifyWorkAlert,
      notify_by_push: data.notifyMobileApp,
      notify_by_voice: false,
      ...(data.escalationEntity
        ? { escalation_management_hierarchy_id: data.escalationEntity }
        : {}),
    };

    setIsSaving(true);
    try {
      if (serverStep) {
        await ProcedureSettingsApi.updateStep(
          procedureSettingId,
          serverStep.id,
          body,
        );
      } else {
        await ProcedureSettingsApi.createStep(procedureSettingId, body);
      }
      setIsEditing(false);
      toast({
        title: t("actions.save"),
        description: serverStep
          ? t("messages.stageUpdated")
          : t("messages.stageAdded"),
        variant: "default",
      });
      onSaved();
    } catch (error) {
      console.error("Error saving document stage:", error);
      toast({
        title: t("actions.save"),
        description: t("messages.error"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": { borderRadius: "8px" },
  } as const;

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          {ts("stageDetails")}
        </Typography>

        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Edit fontSize="small" />}
            onClick={() => setIsEditing(true)}
            disabled={isEditing || isSaving}
          >
            {t("actions.edit")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ContentCopy fontSize="small" />}
            onClick={onCopy}
            disabled={isSaving || !onCopy}
          >
            {ts("copyProcedure")}
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="error"
            startIcon={<Delete fontSize="small" />}
            onClick={onDelete}
            disabled={isSaving}
          >
            {t("actions.delete")}
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        <Controller
          name="procedureName"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              size="small"
              label={<RequiredLabel label={ts("procedureName")} />}
              disabled={fieldsDisabled}
              sx={fieldSx}
            >
              <MenuItem value="">{tc("select")}</MenuItem>
              {procedureNameOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="actionTakerType"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              size="small"
              label={<RequiredLabel label={ts("actionTakerType")} />}
              disabled={fieldsDisabled}
              sx={fieldSx}
            >
              <MenuItem value="">{tc("select")}</MenuItem>
              {actionTakerOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="procedureOrder"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              size="small"
              label={<RequiredLabel label={ts("procedureOrder")} />}
              disabled={fieldsDisabled}
              sx={fieldSx}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((order) => (
                <MenuItem key={order} value={String(order)}>
                  {order}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        <Controller
          name="orgRule"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              size="small"
              label={<RequiredLabel label={ts("orgRule")} />}
              disabled={fieldsDisabled}
              sx={fieldSx}
            >
              <MenuItem value="">{tc("select")}</MenuItem>
              {orgRuleOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="orgTemplate"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              size="small"
              label={<RequiredLabel label={ts("orgTemplates")} />}
              disabled={fieldsDisabled}
              sx={fieldSx}
            >
              <MenuItem value="">{tc("select")}</MenuItem>
              {orgTemplateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gap: 2,
        }}
      >
        <Controller
          name="model"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              size="small"
              label={ts("model")}
              disabled={fieldsDisabled}
              sx={fieldSx}
            >
              <MenuItem value="">{tc("select")}</MenuItem>
              {orgTemplateOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              size="small"
              label={ts("description")}
              disabled={fieldsDisabled}
              sx={fieldSx}
            />
          )}
        />
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          {ts("notifications")}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          {(
            [
              { name: "notifyMobileApp" as const, label: ts("mobileApp") },
              { name: "notifyWorkAlert" as const, label: ts("workAlert") },
              {
                name: "notifySystemEmail" as const,
                label: ts("systemEntryEmail"),
              },
              {
                name: "notifyWhatsapp" as const,
                label: ts("options.notifications.whatsapp"),
              },
            ] as const
          ).map((item) => (
            <Controller
              key={item.name}
              name={item.name}
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      disabled={fieldsDisabled}
                      color="primary"
                    />
                  }
                  label={item.label}
                />
              )}
            />
          ))}
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
          {ts("escalation")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
            mb: 2,
          }}
        >
          <Typography variant="body2">{ts("autoEscalateAfter")}</Typography>
          <Controller
            name="escalateAfter"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                type="number"
                disabled={fieldsDisabled}
                sx={{ width: 72, ...fieldSx }}
                inputProps={{ min: 0 }}
              />
            )}
          />
          <Controller
            name="escalateUnit"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                disabled={fieldsDisabled}
                sx={{ width: 100, ...fieldSx }}
              >
                <MenuItem value="day">{ts("day")}</MenuItem>
                <MenuItem value="hour">{tc("hours")}</MenuItem>
              </TextField>
            )}
          />
          <Typography variant="body2">{ts("to")}</Typography>
          <Controller
            name="escalateTo"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                select
                size="small"
                disabled={fieldsDisabled}
                sx={{ minWidth: 180, ...fieldSx }}
              >
                <MenuItem value="responsible_engineer">
                  {ts("responsibleEngineer")}
                </MenuItem>
              </TextField>
            )}
          />
        </Box>

        <Controller
          name="escalationEntity"
          control={control}
          render={({ field }) => (
            <Box sx={{ width: "100%" }}>
              <SearchableSelect
                options={escalationEntityOptions}
                value={field.value}
                onChange={(value) => field.onChange(String(value))}
                placeholder={ts("escalationEntity")}
                searchPlaceholder={tc("searchManagement")}
                noResultsText={tc("noResults")}
                label={ts("escalationEntity")}
                disabled={fieldsDisabled}
              />
            </Box>
          )}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isEditing || isSaving}
          sx={{
            px: 4,
            py: 1.25,
            borderRadius: 2,
            fontWeight: 700,
            minWidth: 160,
          }}
        >
          {ts("saveStage")}
        </Button>
      </Box>
    </Box>
  );
}
