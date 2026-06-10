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
  TextField,
  Typography,
} from "@mui/material";
import { Delete, Edit, KeyboardArrowDown } from "@mui/icons-material";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { baseURL } from "@/config/axios-config";
import { useAllEmployees } from "@/modules/hr-settings/tabs/procedures-settings/hooks/useAllEmployees";
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
import SearchableSelect from "@/components/shared/SearchableSelect";
import { withEmptyOption } from "@/modules/hr-settings/tabs/procedures-settings/utils/selectOptions";

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
  { value: "accreditation_form", label: "نموذج قبول" },
] as const;

const NOTIFICATION_OPTIONS = [
  { value: "email", label: "بريد" },
  { value: "whatsapp", label: "واتساب" },
] as const;

const ACTION_TAKER_TYPE_OPTIONS = [
  { value: "specific_user", label: "لمستخدم محدد" },
  { value: "management_hierarchy", label: "الهيكل التنظيمي" },
] as const;

const MANAGEMENT_HIERARCHY_TYPE_OPTIONS = [
  { value: "branch_manager", label: "مدير الفرع" },
  { value: "management_manager", label: "مدير الاداره" },
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
  actionTakerType: string;
  actionTakerManagementHierarchyType: string;
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

function firstActionTakerUserId(step: ProcedureStep | null): string {
  if (!step) return "";
  const fromArr = step.action_taker_user_ids?.[0];
  if (fromArr != null && String(fromArr).length > 0) return String(fromArr);
  const nested = step.action_takers?.[0]?.user?.id;
  if (nested != null) return String(nested);
  if (step.employee_id != null && String(step.employee_id).length > 0) {
    return String(step.employee_id);
  }
  return "";
}

function firstConcernedUserId(step: ProcedureStep | null): string {
  if (!step) return "";
  const fromArr = step.concerned_management_hierarchy_ids?.[0];
  if (fromArr != null && String(fromArr).length > 0) return String(fromArr);
  const nested = step.concerned_users?.[0]?.user?.id;
  if (nested != null) return String(nested);
  return "";
}

function resolveActionTakerName(
  step: ProcedureStep | null,
  userId: string,
): string {
  if (!step || !userId) return "";
  const idStr = String(userId);
  const hit = step.action_takers?.find(
    (at) => at.user?.id != null && String(at.user.id) === idStr,
  );
  return (
    hit?.user?.name?.trim() ||
    (String(step.employee_id) === idStr ? step.employee?.name?.trim() : "") ||
    ""
  );
}

function resolveConcernedUserName(
  step: ProcedureStep | null,
  userId: string,
): string {
  if (!step || !userId) return "";
  const idStr = String(userId);
  const hit = step.concerned_users?.find(
    (cu) => cu.user?.id != null && String(cu.user.id) === idStr,
  );
  return hit?.user?.name?.trim() || "";
}

function ensureSelectedEmployeeRow(
  rows: { value: string; label: string }[],
  id: string,
  resolvedName: string,
): { value: string; label: string }[] {
  const sid = String(id);
  if (!sid) return rows;
  const idx = rows.findIndex((r) => String(r.value) === sid);
  const label = resolvedName.trim() || (idx >= 0 ? rows[idx].label : "") || sid;
  if (idx >= 0) {
    const next = [...rows];
    next[idx] = { value: sid, label };
    return next;
  }
  return [...rows, { value: sid, label }];
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
      actionTakerType: serverStep.action_taker_type ?? "specific_user",
      actionTakerManagementHierarchyType:
        serverStep.action_taker_management_hierarchy_type ?? "",
      branchId: serverStep.branch_id ? String(serverStep.branch_id) : "",
      managementId: serverStep.management_id
        ? String(serverStep.management_id)
        : "",
      actionTakerId: firstActionTakerUserId(serverStep),
      concernedUserId: firstConcernedUserId(serverStep),
      orgBase: base.length ? base : ["approve"],
      orgTemplate:
        formsKindToStepCardUi(parseProcedureStepFormsKind(serverStep)) ===
        "accept"
          ? "accreditation_form"
          : "approve",
      notifications,
      deadlineDays: String(serverStep.approval_within_days || 0),
      deadlineHours: String(serverStep.approval_within_hours || 0),
      escalationUserId: serverStep.escalation_management_hierarchy_id ?? "",
    };
  }
  return {
    stepName: "",
    actionTakerType: "specific_user",
    actionTakerManagementHierarchyType: "",
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
  const actionTakerType = watch("actionTakerType");
  const branchId = watch("branchId");
  const actionTakerIdW = watch("actionTakerId");
  const concernedUserIdW = watch("concernedUserId");
  const fieldsDisabled = !!serverStep && !isEditing;

  const syncFromServer = useCallback(() => {
    reset(getDefaultValues(serverStep));
  }, [serverStep, reset]);

  useEffect(() => {
    setIsEditing(!serverStep);
    syncFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverStep]);

  const { data: employeesData = [] } = useAllEmployees();

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

  const branchSelectOptions = useMemo(
    () =>
      withEmptyOption(
        branches.map((b) => ({ value: String(b.id), label: b.name })),
        "اختر الفرع",
      ),
    [branches],
  );

  const managementSelectOptions = useMemo(
    () =>
      withEmptyOption(
        managements.map((m) => ({ value: String(m.id), label: m.name })),
        "اختر الادارة",
      ),
    [managements],
  );

  const employeeRows = useMemo(
    () => employeesData.map((e) => ({ value: String(e.id), label: e.name })),
    [employeesData],
  );

  const managementRows = useMemo(
    () => managements.map((m) => ({ value: String(m.id), label: m.name })),
    [managements],
  );

  const actionTakerSelectOptions = useMemo(() => {
    let rows = [...employeeRows];
    if (serverStep) {
      const id = firstActionTakerUserId(serverStep);
      const name = resolveActionTakerName(serverStep, id);
      if (id) rows = ensureSelectedEmployeeRow(rows, id, name);
    }
    return withEmptyOption(rows, "متخذي الاجراء");
  }, [employeeRows, serverStep]);

  const concernedUserSelectOptions = useMemo(() => {
    let rows = [...managementRows];
    if (serverStep) {
      const id = firstConcernedUserId(serverStep);
      const name = resolveConcernedUserName(serverStep, id);
      if (id) rows = ensureSelectedEmployeeRow(rows, id, name);
    }
    return withEmptyOption(rows, "المعنيين بالاجراء");
  }, [managementRows, serverStep]);

  const actionTakerDisplayLabel = useMemo(() => {
    if (!fieldsDisabled || !actionTakerIdW) return undefined;
    const id = String(actionTakerIdW);
    const fromApi = serverStep ? resolveActionTakerName(serverStep, id) : "";
    const fromList =
      employeeRows.find((r) => String(r.value) === id)?.label ?? "";
    const text = (fromApi || fromList).trim();
    return text || id;
  }, [fieldsDisabled, actionTakerIdW, serverStep, employeeRows]);

  const concernedUserDisplayLabel = useMemo(() => {
    if (!fieldsDisabled || !concernedUserIdW) return undefined;
    const id = String(concernedUserIdW);
    const fromApi = serverStep ? resolveConcernedUserName(serverStep, id) : "";
    const fromList =
      managementRows.find((r) => String(r.value) === id)?.label ?? "";
    const text = (fromApi || fromList).trim();
    return text || id;
  }, [fieldsDisabled, concernedUserIdW, serverStep, managementRows]);

  const escalationUserSelectOptions = useMemo(
    () => withEmptyOption(managementRows, "اختر الجهة المصعد إليها"),
    [managementRows],
  );

  const orgTemplateSelectOptions = useMemo(
    () =>
      ORG_TEMPLATE_OPTIONS.map((o) => ({
        value: o.value,
        label: o.label,
      })),
    [],
  );

  const toggleArrayValue = (current: string[], val: string): string[] =>
    current.includes(val)
      ? current.filter((v) => v !== val)
      : [...current, val];

  const onSubmit = async (data: StepFormData) => {
    if (data.actionTakerType === "specific_user" && !data.actionTakerId) {
      toast({
        title: t("actions.save"),
        description: t("steps.selectEmployee"),
        variant: "destructive",
      });
      return;
    }
    if (
      data.actionTakerType === "management_hierarchy" &&
      !data.actionTakerManagementHierarchyType
    ) {
      toast({
        title: t("actions.save"),
        description: "يرجى اختيار نوع الهيكل التنظيمي",
        variant: "destructive",
      });
      return;
    }

    const body: CreateStepArgs = {
      name: data.stepName.trim(),
      action_taker_type: data.actionTakerType,
      action_taker_management_hierarchy_type:
        data.actionTakerManagementHierarchyType,
      action_taker_user_ids:
        data.actionTakerType === "specific_user" && data.actionTakerId
          ? [data.actionTakerId]
          : [],
      concerned_management_hierarchy_ids: data.concernedUserId
        ? [data.concernedUserId]
        : [],
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
        ? { escalation_management_hierarchy_id: data.escalationUserId }
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
          mt: 2,
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
                        concerned_management_hierarchy_ids:
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
                          concerned_management_hierarchy_ids:
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

        {/* ── نوع متخذي الإجراء ── */}
        <Box sx={{ mb: 2.5 }}>
          <SectionLabel>نوع متخذي الإجراء</SectionLabel>
          <Controller
            name="actionTakerType"
            control={control}
            render={({ field }) => (
              <Box sx={{ width: "100%" }}>
                <SearchableSelect
                  options={ACTION_TAKER_TYPE_OPTIONS.map((o) => ({
                    value: o.value,
                    label: o.label,
                  }))}
                  value={field.value ?? "specific_user"}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder="اختر نوع متخذي الإجراء"
                  searchPlaceholder="البحث..."
                  noResultsText="لا توجد نتائج"
                  disabled={fieldsDisabled}
                />
              </Box>
            )}
          />
        </Box>

        {/* ── نوع الهيكل التنظيمي (conditional) ── */}
        {actionTakerType === "management_hierarchy" && (
          <Box sx={{ mb: 2.5 }}>
            <SectionLabel>نوع الهيكل التنظيمي</SectionLabel>
            <Controller
              name="actionTakerManagementHierarchyType"
              control={control}
              render={({ field }) => (
                <Box sx={{ width: "100%" }}>
                  <SearchableSelect
                    options={MANAGEMENT_HIERARCHY_TYPE_OPTIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                    value={field.value ?? ""}
                    onChange={(v) => field.onChange(String(v))}
                    placeholder="اختر نوع الهيكل التنظيمي"
                    searchPlaceholder="البحث..."
                    noResultsText="لا توجد نتائج"
                    disabled={fieldsDisabled}
                  />
                </Box>
              )}
            />
          </Box>
        )}

        {/* ── الوحدة التنظيمية — 2-column grid of dropdowns (only show if specific_user) ── */}
        {actionTakerType === "specific_user" && (
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
                    <Box sx={{ width: "100%" }}>
                      <SearchableSelect
                        options={branchSelectOptions}
                        value={field.value ?? ""}
                        onChange={(v) => field.onChange(String(v))}
                        placeholder="اختر الفرع"
                        searchPlaceholder="البحث..."
                        noResultsText="لا توجد نتائج"
                        disabled={fieldsDisabled}
                      />
                    </Box>
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
                    <Box sx={{ width: "100%" }}>
                      <SearchableSelect
                        options={managementSelectOptions}
                        value={field.value ?? ""}
                        onChange={(v) => field.onChange(String(v))}
                        placeholder="اختر الادارة"
                        searchPlaceholder="البحث..."
                        noResultsText="لا توجد نتائج"
                        disabled={fieldsDisabled || !branchId}
                      />
                    </Box>
                  )}
                />
              </Box>
            </Grid>

            {/* متخذي الاجراء (only show if specific_user) */}
            {actionTakerType === "specific_user" && (
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
                      <Box sx={{ width: "100%" }}>
                        <SearchableSelect
                          options={actionTakerSelectOptions}
                          value={field.value ?? ""}
                          onChange={(v) => field.onChange(String(v))}
                          placeholder="متخذي الاجراء"
                          searchPlaceholder="البحث عن اداره..."
                          noResultsText="لا توجد نتائج"
                          disabled={fieldsDisabled}
                          displayLabel={
                            fieldsDisabled ? actionTakerDisplayLabel : undefined
                          }
                        />
                      </Box>
                    )}
                  />
                </Box>
              </Grid>
            )}

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
                    <Box sx={{ width: "100%" }}>
                      <SearchableSelect
                        options={concernedUserSelectOptions}
                        value={field.value ?? ""}
                        onChange={(v) => field.onChange(String(v))}
                        placeholder="المعنيين بالاجراء"
                        searchPlaceholder="البحث عن اداره..."
                        noResultsText="لا توجد نتائج"
                        disabled={fieldsDisabled}
                        displayLabel={
                          fieldsDisabled ? concernedUserDisplayLabel : undefined
                        }
                      />
                    </Box>
                  )}
                />
              </Box>
            </Grid>
            </Grid>
          </Box>
        )}

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
              <Box sx={{ width: "100%" }}>
                <SearchableSelect
                  options={orgTemplateSelectOptions}
                  value={field.value ?? "approve"}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder="نموذج"
                  searchPlaceholder="البحث..."
                  noResultsText="لا توجد نتائج"
                  disabled={fieldsDisabled}
                />
              </Box>
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
                  <Box sx={{ width: "100%" }}>
                    <SearchableSelect
                      options={escalationUserSelectOptions}
                      value={field.value ?? ""}
                      onChange={(v) => field.onChange(String(v))}
                      placeholder="اختر الجهة المصعد إليها"
                      searchPlaceholder="البحث عن اداره..."
                      noResultsText="لا توجد نتائج"
                      disabled={fieldsDisabled}
                    />
                  </Box>
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
