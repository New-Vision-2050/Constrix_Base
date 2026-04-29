"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit, KeyboardArrowDown } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { apiClient, baseURL } from "@/config/axios-config";
import {
  fetchManagementHierarchyOptions,
  type ManagementHierarchyOption,
} from "@/utils/fetchDropdownOptions";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import { ProcedureStep } from "@/services/api/crm-settings/procedure-settings/types/response";
import {
  coerceStepBoolean,
  formsKindToStepCardUi,
  parseProcedureStepFormsKind,
} from "@/services/api/crm-settings/procedure-settings/parse-step-forms";
import { CreateStepArgs } from "@/services/api/crm-settings/procedure-settings/types/args";
import { useToast } from "@/modules/table/hooks/use-toast";

interface EmployeeOption {
  id: string;
  name: string;
  email: string;
}

// ─── Option constants ─────────────────────────────────────────────────────────
const ORG_BASE_OPTIONS = [
  { value: "approve", label: "موافقه" },
  { value: "accept", label: "قبول" },
  { value: "view_only", label: "اطلاع" },
  { value: "return_with_notes", label: "اعاده بملاحظات" },
  { value: "approve_timed", label: "موافقه اليه خلال ( مده )" },
] as const;

const ORG_TEMPLATE_OPTIONS = [
  { value: "approve", label: "نموذج موافقه" },
] as const;

const NOTIFICATION_OPTIONS = [
  { value: "email", label: "بريد" },
  { value: "whatsapp", label: "واتساب" },
] as const;

// TIME_UNITS removed - now using separate day/hour inputs

interface StepCardProps {
  procedureSettingId: string;
  serverStep: ProcedureStep | null;
  stepIndex?: number;
  onSaved: () => void;
  onDelete: () => void;
}

interface StepFormData {
  stepName: string;
  branchId: string;
  managementId: string;
  actionTakerId: string;
  concernedUserId: string;
  orgBase: string[];
  orgTemplate: string;
  notifications: string[];
  deadlineDays: string;
  deadlineHours: string;
  escalationUserId: string;
}

const getDefaultValues = (serverStep: ProcedureStep | null): StepFormData => {
  if (serverStep) {
    const base: string[] = [];
    if (coerceStepBoolean(serverStep.is_approve)) base.push("approve");
    if (coerceStepBoolean(serverStep.is_accept)) base.push("accept");
    if (coerceStepBoolean(serverStep.is_view_only)) base.push("view_only");
    if (coerceStepBoolean(serverStep.is_return_with_notes))
      base.push("return_with_notes");
    if (coerceStepBoolean(serverStep.requires_approval_within_period))
      base.push("approve_timed");

    const notifications: string[] = [];
    if (serverStep.notify_by_email) notifications.push("email");
    if (serverStep.notify_by_whatsapp) notifications.push("whatsapp");

    return {
      stepName: serverStep.name?.trim() ?? "",
      branchId: serverStep.branch_id ? String(serverStep.branch_id) : "",
      managementId: serverStep.management_id
        ? String(serverStep.management_id)
        : "",
      actionTakerId: serverStep.action_taker_user_ids?.[0] ?? "",
      concernedUserId: serverStep.concerned_user_ids?.[0] ?? "",
      orgBase: base.length ? base : ["approve"],
      orgTemplate:
        formsKindToStepCardUi(parseProcedureStepFormsKind(serverStep)) ===
        "accept"
          ? "accreditation_form"
          : "approve",
      notifications,
      deadlineDays: String(serverStep.approval_within_days || 0),
      deadlineHours: String(serverStep.approval_within_hours || 0),
      escalationUserId: serverStep.escalation_user_id ?? "",
    };
  }
  return {
    stepName: "",
    branchId: "",
    managementId: "",
    actionTakerId: "",
    concernedUserId: "",
    orgBase: ["approve"],
    orgTemplate: "approve",
    notifications: [],
    deadlineDays: "0",
    deadlineHours: "6",
    escalationUserId: "",
  };
};

export default function StepCard({
  procedureSettingId,
  serverStep,
  stepIndex = 1,
  onSaved,
  onDelete,
}: StepCardProps) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings");
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!serverStep);
  const [isExpanded, setIsExpanded] = useState(!serverStep);

  const { control, handleSubmit, reset, watch } = useForm<StepFormData>({
    defaultValues: getDefaultValues(serverStep),
  });

  const stepName = watch("stepName");
  const branchId = watch("branchId");
  const fieldsDisabled = !!serverStep && !isEditing;

  const syncFromServer = useCallback(() => {
    reset(getDefaultValues(serverStep));
  }, [serverStep, reset]);

  useEffect(() => {
    setIsEditing(!serverStep);
    syncFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverStep]);

  const { data: employeesData = [] } = useQuery<EmployeeOption[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await apiClient.get("/company-users/employees");
      const payload = response.data?.payload ?? response.data;
      return Array.isArray(payload) ? payload : [];
    },
  });

  const { data: managements = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["managements", "hierarchy", "management", branchId],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=management${branchId ? `&branch_id=${branchId}` : ""}`,
      ),
    enabled: !!branchId,
  });

  const { data: branches = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["branches"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=branch`,
      ),
  });

  const toggleArrayValue = (current: string[], val: string): string[] =>
    current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];

  const onSubmit = async (data: StepFormData) => {
    if (!data.actionTakerId) {
      toast({
        title: t("actions.save"),
        description: t("steps.selectEmployee"),
        variant: "destructive",
      });
      return;
    }

    const body: CreateStepArgs = {
      name: data.stepName.trim(),
      action_taker_user_ids: data.actionTakerId ? [data.actionTakerId] : [],
      concerned_user_ids: data.concernedUserId ? [data.concernedUserId] : [],
      is_approve: data.orgBase.includes("approve"),
      is_accept: data.orgBase.includes("accept"),
      is_view_only: data.orgBase.includes("view_only"),
      is_return_with_notes: data.orgBase.includes("return_with_notes"),
      requires_approval_within_period: data.orgBase.includes("approve_timed"),
      forms: data.orgTemplate === "accreditation_form" ? "accept" : "approve",
      notify_by_email: data.notifications.includes("email"),
      notify_by_whatsapp: data.notifications.includes("whatsapp"),
      ...(data.branchId ? { branch_id: Number(data.branchId) } : {}),
      ...(data.managementId
        ? { management_id: Number(data.managementId) }
        : {}),
      ...(data.escalationUserId
        ? { escalation_user_id: data.escalationUserId }
        : {}),
      approval_within_days: Number(data.deadlineDays) || 0,
      approval_within_hours: Number(data.deadlineHours) || 0,
    };

    setIsSaving(true);
    try {
      if (serverStep) {
        await ProcedureSettingsApi.updateStep(
          procedureSettingId,
          serverStep.id,
          body,
        );
        setIsEditing(false);
      } else {
        await ProcedureSettingsApi.createStep(procedureSettingId, body);
        setIsEditing(false); // Switch to view mode after add
        setIsExpanded(false); // Collapse after add
      }
      toast({
        title: t("actions.save"),
        description: serverStep
          ? t("messages.stageUpdated")
          : t("messages.stageAdded"),
        variant: "default",
      });
      onSaved();
    } catch (error) {
      console.error("Error saving step:", error);
      toast({
        title: t("actions.save"),
        description: t("messages.error"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ── layout helpers ──────────────────────────────────────────────────────────
  const SectionLabel = ({ children }: { children: string }) => (
    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
      {children}
    </Typography>
  );

  const CheckRow = ({
    options,
    selected,
    onToggle,
  }: {
    options: readonly { value: string; label: string }[];
    selected: string[];
    onToggle: (val: string) => void;
  }) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
      }}
    >
      {options.map((opt) => (
        <FormControlLabel
          key={opt.value}
          labelPlacement="end"
          label={opt.label}
          control={
            <Checkbox
              size="small"
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
              disabled={fieldsDisabled}
            />
          }
        />
      ))}
    </Box>
  );

  return (
    <Accordion
      expanded={isExpanded}
      onChange={(_, expanded) => setIsExpanded(expanded)}
      disableGutters
    >
      <AccordionSummary
        sx={{
          flexDirection: "row-reverse",
          px: 1.5,
          py: 0.5,
          "& .MuiAccordionSummary-content": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            margin: 0,
          },
        }}
      >
        {/* Right side - Stage name with dropdown icon */}
        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <KeyboardArrowDown
            sx={{
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          />
          <Typography variant="subtitle1" fontWeight={600}>
            {stepName || `${t("steps.stage")} ${stepIndex}`}
          </Typography>
        </Box>
        {/* Left side - Edit & Delete controls (NO BUTTONS) */}
        <Box
          sx={{ display: "flex", gap: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isEditing ? (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                mt: 2.5,
                justifyContent: "flex-end",
              }}
            >
              <Box
                component="span"
                role="button"
                tabIndex={0}
                aria-disabled={isEditing}
                onClick={async (e) => {
                  if (isEditing) return;
                  e.stopPropagation();
                  if (serverStep) {
                    try {
                      const res = await ProcedureSettingsApi.getStep(
                        procedureSettingId,
                        serverStep.id,
                      );
                      const stepData = res?.data?.payload || res?.data || res;
                      // Map API response to form fields
                      const mappedData: ProcedureStep = {
                        ...stepData,
                        action_taker_user_ids:
                          stepData.action_takers?.map(
                            (at: { user: { id: string } }) => at.user.id,
                          ) || [],
                        concerned_user_ids:
                          stepData.concerned_users?.map(
                            (cu: { user: { id: string } }) => cu.user.id,
                          ) || [],
                      };
                      reset(getDefaultValues(mappedData));
                    } catch {
                      // fallback: continue with existing data
                    }
                  }
                  setIsEditing(true);
                  setIsExpanded(true);
                }}
                onKeyDown={async (e) => {
                  if ((e.key === "Enter" || e.key === " ") && !isEditing) {
                    e.preventDefault();
                    if (serverStep) {
                      try {
                        const res = await ProcedureSettingsApi.getStep(
                          procedureSettingId,
                          serverStep.id,
                        );
                        const stepData = res?.data?.payload || res?.data || res;
                        // Map API response to form fields
                        const mappedData: ProcedureStep = {
                          ...stepData,
                          action_taker_user_ids:
                            stepData.action_takers?.map(
                              (at: { user: { id: string } }) => at.user.id,
                            ) || [],
                          concerned_user_ids:
                            stepData.concerned_users?.map(
                              (cu: { user: { id: string } }) => cu.user.id,
                            ) || [],
                        };
                        reset(getDefaultValues(mappedData));
                      } catch {}
                    }
                    setIsEditing(true);
                    setIsExpanded(true);
                  }
                }}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  border: 1,
                  borderColor: "divider",
                  color: "text.primary",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  cursor: isEditing ? "not-allowed" : "pointer",
                  opacity: isEditing ? 0.5 : 1,
                  userSelect: "none",
                  outline: "none",
                  transition: "background 0.2s, border-color 0.2s",
                  "&:hover, &:focus-visible": {
                    borderColor: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Edit fontSize="small" />
                {t("actions.edit")}
              </Box>
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2.5,
                  justifyContent: "flex-end",
                }}
              >
                <Box
                  component="span"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isSaving) handleSubmit(onSubmit)();
                  }}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !isSaving) {
                      e.preventDefault();
                      handleSubmit(onSubmit)();
                    }
                  }}
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    cursor: isSaving ? "not-allowed" : "pointer",
                    opacity: isSaving ? 0.5 : 1,
                    userSelect: "none",
                    outline: "none",
                    transition: "background 0.2s",
                    "&:hover, &:focus-visible": {
                      bgcolor: "primary.dark",
                    },
                  }}
                >
                  {t("actions.save")}
                </Box>
                {/* Only show Cancel if editing an existing step */}
                {serverStep && (
                  <Box
                    component="span"
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isSaving) {
                        syncFromServer();
                        setIsEditing(false);
                      }
                    }}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && !isSaving) {
                        e.preventDefault();
                        syncFromServer();
                        setIsEditing(false);
                      }
                    }}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 0.5,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      border: 1,
                      borderColor: "divider",
                      color: "text.primary",
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      cursor: isSaving ? "not-allowed" : "pointer",
                      opacity: isSaving ? 0.5 : 1,
                      userSelect: "none",
                      outline: "none",
                      transition: "background 0.2s, border-color 0.2s",
                      "&:hover, &:focus-visible": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {t("actions.cancel")}
                  </Box>
                )}
              </Box>
            </>
          )}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 2.5,
              justifyContent: "flex-end",
            }}
          >
            <Box
              component="span"
              role="button"
              tabIndex={0}
              onClick={(e) => {
                if (isSaving) return;
                e.stopPropagation();
                onDelete();
              }}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !isSaving) {
                  e.preventDefault();
                  onDelete();
                }
              }}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
                border: 1,
                borderColor: "error.main",
                color: "error.main",
                fontSize: "0.875rem",
                fontWeight: 500,
                cursor: isSaving ? "not-allowed" : "pointer",
                opacity: isSaving ? 0.5 : 1,
                userSelect: "none",
                outline: "none",
                transition: "background 0.2s, border-color 0.2s",
                "&:hover, &:focus-visible": {
                  bgcolor: "error.lighter",
                },
              }}
            >
              <Delete fontSize="small" />
              {t("actions.delete")}
            </Box>
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 2.5 }}>
        {/* Step name input */}
        <Box sx={{ mb: 2.5 }}>
          <Controller
            name="stepName"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                placeholder={t("steps.enterStepName")}
                disabled={fieldsDisabled}
                fullWidth
              />
            )}
          />
        </Box>

        {/* ── الوحدة التنظيمية — 2-column grid of dropdowns ── */}
        <Box sx={{ mb: 2.5 }}>
          <SectionLabel>الوحدة التنظيمية</SectionLabel>
          <Grid container spacing={2}>
            {/* الفرع */}
            <Grid size={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1.5,
                }}
              >
                <Controller
                  name="branchId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      size="small"
                      fullWidth
                      disabled={fieldsDisabled}
                    >
                      <MenuItem value="">اختر الفرع</MenuItem>
                      {branches.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Box>
            </Grid>

            {/* الادارة */}
            <Grid size={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1.5,
                }}
              >
                <Controller
                  name="managementId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      size="small"
                      fullWidth
                      disabled={fieldsDisabled}
                    >
                      <MenuItem value="">اختر الادارة</MenuItem>
                      {managements.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Box>
            </Grid>

            {/* متخذي الاجراء */}
            <Grid size={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1.5,
                }}
              >
                <Controller
                  name="actionTakerId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      size="small"
                      fullWidth
                      disabled={fieldsDisabled}
                    >
                      <MenuItem value="">متخذي الاجراء</MenuItem>
                      {employeesData.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Box>
            </Grid>

            {/* المعنيين بالاجراء */}
            <Grid size={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 1.5,
                }}
              >
                <Controller
                  name="concernedUserId"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      displayEmpty
                      size="small"
                      fullWidth
                      disabled={fieldsDisabled}
                    >
                      <MenuItem value="">المعنيين بالاجراء</MenuItem>
                      {employeesData.map((opt) => (
                        <MenuItem key={opt.id} value={opt.id}>
                          {opt.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* ── القاعدة التنظيمية — checkboxes ── */}
        <Box sx={{ mb: 2.5 }}>
          <SectionLabel>القاعدة التنظيمية</SectionLabel>
          <Controller
            name="orgBase"
            control={control}
            render={({ field }) => (
              <CheckRow
                options={ORG_BASE_OPTIONS}
                selected={field.value}
                onToggle={(v) =>
                  field.onChange(toggleArrayValue(field.value, v))
                }
              />
            )}
          />
        </Box>

        {/* ── النماذج التنظيمية — dropdown ── */}
        <Box sx={{ mb: 2.5 }}>
          <SectionLabel>النماذج التنظيمية</SectionLabel>
          <Controller
            name="orgTemplate"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                displayEmpty
                size="small"
                fullWidth
                disabled={fieldsDisabled}
              >
                {ORG_TEMPLATE_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        </Box>

        {/* ── الاعلامات — checkboxes ── */}
        <Box sx={{ mb: 2.5 }}>
          <SectionLabel>الاعلامات</SectionLabel>
          <Controller
            name="notifications"
            control={control}
            render={({ field }) => (
              <CheckRow
                options={NOTIFICATION_OPTIONS}
                selected={field.value}
                onToggle={(v) =>
                  field.onChange(toggleArrayValue(field.value, v))
                }
              />
            )}
          />
        </Box>

        {/* ── التصعيد — main section containing المهلة الزمنية ── */}
        <Box
          sx={{
            p: 2,
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
            التصعيد
          </Typography>

          {/* المهلة الزمنية inside التصعيد */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              المهلة الزمنية
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Controller
                  name="deadlineDays"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      disabled={fieldsDisabled}
                      sx={{ width: 80 }}
                      inputProps={{ min: 0, style: { textAlign: "center" } }}
                    />
                  )}
                />
                <Typography variant="body2">أيام</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Controller
                  name="deadlineHours"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      size="small"
                      disabled={fieldsDisabled}
                      sx={{ width: 80 }}
                      inputProps={{ min: 0, style: { textAlign: "center" } }}
                    />
                  )}
                />
                <Typography variant="body2">ساعات</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* الجهة المصعد إليها */}
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              الجهة المصعد إليها
            </Typography>
            <Controller
              name="escalationUserId"
              control={control}
              render={({ field }) => (
                <>
                  <Select
                    {...field}
                    displayEmpty
                    size="small"
                    fullWidth
                    disabled={fieldsDisabled}
                  >
                    <MenuItem value="">اختر الجهة المصعد إليها</MenuItem>
                    {employeesData.map((emp) => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {field.value && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block", textAlign: "end" }}
                    >
                      الجهة المصعد إليها محول الاعتماد
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
