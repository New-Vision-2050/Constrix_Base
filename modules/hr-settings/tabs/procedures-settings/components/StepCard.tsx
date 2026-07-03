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
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit, KeyboardArrowDown } from "@mui/icons-material";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useProceduresSettingsTranslations } from "../hooks/useProceduresSettingsTranslations";
import { useQuery } from "@tanstack/react-query";
import { apiClient, baseURL } from "@/config/axios-config";
import { useAllEmployees } from "@/modules/hr-settings/tabs/procedures-settings/hooks/useAllEmployees";
import {
  fetchManagementHierarchyOptions,
  type ManagementHierarchyOption,
} from "@/utils/fetchDropdownOptions";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import { ProcedureStep } from "@/services/api/crm-settings/procedure-settings/types/response";
import {
  coerceStepBoolean,
} from "@/services/api/crm-settings/procedure-settings/parse-step-forms";
import { CreateStepArgs } from "@/services/api/crm-settings/procedure-settings/types/args";
import { useToast } from "@/modules/table/hooks/use-toast";
import SearchableSelect from "@/components/shared/SearchableSelect";
import { withEmptyOption } from "@/modules/hr-settings/tabs/procedures-settings/utils/selectOptions";

// ─── Option value constants (labels from i18n inside component) ───────────────
const ORG_BASE_OPTION_DEFS = [
  { value: "approve", labelKey: "orgBase.approve" as const },
  { value: "view_only", labelKey: "orgBase.viewOnly" as const, disabled: true },
  {
    value: "return_with_notes",
    labelKey: "orgBase.returnWithNotes" as const,
    disabled: true,
  },
  { value: "approve_timed", labelKey: "orgBase.approveTimed" as const },
] as const;

const ORG_TEMPLATE_OPTION_DEFS = [
  { value: "approve", labelKey: "orgTemplate.approve" as const },
] as const;

const NOTIFICATION_OPTION_DEFS = [
  { value: "email", labelKey: "notifications.email" as const },
  { value: "whatsapp", labelKey: "notifications.whatsapp" as const },
  { value: "sms", labelKey: "notifications.sms" as const },
  { value: "push", labelKey: "notifications.push" as const },
  { value: "voice", labelKey: "notifications.voice" as const },
] as const;

const ACTION_TAKER_TYPE_OPTION_DEFS = [
  { value: "specific_user", labelKey: "actionTakerType.specificUser" as const },
  {
    value: "management_hierarchy",
    labelKey: "actionTakerType.managementHierarchy" as const,
  },
  {
    value: "specific_procedures",
    labelKey: "actionTakerType.specificProcedures" as const,
  },
  { value: "assigned_user", labelKey: "actionTakerType.assignedUser" as const },
  { value: "himself", labelKey: "actionTakerType.himself" as const },
] as const;

const MANAGEMENT_HIERARCHY_TYPE_OPTION_DEFS = [
  { value: "project_manager", labelKey: "managementHierarchy.projectManager" as const },
  { value: "branch_manager", labelKey: "managementHierarchy.branchManager" as const },
  {
    value: "management_manager",
    labelKey: "managementHierarchy.managementManager" as const,
  },
] as const;

const SPECIFIC_PROCEDURE_ENTITY_OPTION_DEFS = [
  { value: "branch", labelKey: "specificProcedureEntity.branch" as const },
  { value: "management", labelKey: "specificProcedureEntity.management" as const },
  { value: "job_title", labelKey: "specificProcedureEntity.jobTitle" as const },
  { value: "job_role", labelKey: "specificProcedureEntity.jobRole" as const },
] as const;

const JOB_ROLE_OPTION_DEFS = [
  { id: "1", labelKey: "jobRole.managementManager" as const },
  { id: "2", labelKey: "jobRole.branchManager" as const },
] as const;

async function fetchNamedListOptions(
  url: string,
): Promise<ManagementHierarchyOption[]> {
  const res = await apiClient.get(url, { params: { per_page: 200, page: 1 } });
  const rows = res.data?.payload ?? res.data ?? [];
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row: { id?: unknown; name?: unknown }) => ({
      id: String(row.id ?? ""),
      name: String(row.name ?? "").trim(),
    }))
    .filter((m) => m.id.length > 0);
}

// TIME_UNITS removed - now using separate day/hour inputs

interface StepCardProps {
  procedureSettingId: string;
  serverStep: ProcedureStep | null;
  stepIndex?: number;
  onSaved: () => void;
  onDelete: () => void;
}

interface SpecificProcedureRow {
  type: string;
  id: string;
}

interface ManagementHierarchyRow {
  type: string;
  isDeputyDirector: boolean;
}

interface StepFormData {
  stepName: string;
  actionTakerType: string;
  actionTakerManagementHierarchyRows: ManagementHierarchyRow[];
  actionTakerSpecificProcedureRows: SpecificProcedureRow[];
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

function toStringArray(val: string | string[] | null | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return [val];
}

function normalizeSpecificProcedureRows(step: ProcedureStep): SpecificProcedureRow[] {
  if (step.action_taker_specific_procedures?.length) {
    return step.action_taker_specific_procedures.map((r) => ({
      type: r.type ?? "",
      id: String(r.id ?? ""),
    }));
  }
  const types = toStringArray(step.action_taker_specific_procedure_type);
  const ids = toStringArray(
    typeof step.action_taker_specific_procedure_id === "number"
      ? String(step.action_taker_specific_procedure_id)
      : step.action_taker_specific_procedure_id,
  );
  if (!types.length) return [{ type: "", id: "" }];
  return types.map((t, i) => ({ type: t, id: ids[i] ?? "" }));
}

function dedupeManagementHierarchyRows(
  rows: ManagementHierarchyRow[],
): ManagementHierarchyRow[] {
  const seen = new Set<string>();
  const deduped: ManagementHierarchyRow[] = [];
  for (const row of rows) {
    if (!row.type) {
      deduped.push(row);
      continue;
    }
    if (seen.has(row.type)) continue;
    seen.add(row.type);
    deduped.push(row);
  }
  return deduped.slice(0, MANAGEMENT_HIERARCHY_TYPE_OPTION_DEFS.length);
}

function normalizeManagementHierarchyRows(
  step: ProcedureStep,
): ManagementHierarchyRow[] {
  if (step.action_taker_management_hierarchies?.length) {
    return dedupeManagementHierarchyRows(
      step.action_taker_management_hierarchies.map((row) => ({
        type: row.action_taker_management_hierarchy_type ?? "",
        isDeputyDirector: coerceStepBoolean(row.is_Deputy_Director),
      })),
    );
  }

  const rows: ManagementHierarchyRow[] = [];
  const primary = step.action_taker_management_hierarchy_type ?? "";
  if (primary) {
    rows.push({
      type: primary === "deputy_manager" ? "" : primary,
      isDeputyDirector: primary === "deputy_manager",
    });
  }

  for (const alt of toStringArray(
    step.action_taker_alternative_management_hierarchy_type,
  )) {
    rows.push({
      type: alt === "deputy_manager" ? "" : alt,
      isDeputyDirector: alt === "deputy_manager",
    });
  }

  if (!rows.length) return [{ type: "", isDeputyDirector: false }];
  return dedupeManagementHierarchyRows(rows);
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
    if (serverStep.notify_by_sms) notifications.push("sms");
    if (serverStep.notify_by_push) notifications.push("push");
    if (serverStep.notify_by_voice) notifications.push("voice");

    const actionTakerType = serverStep.action_taker_type ?? "specific_user";
    return {
      stepName: serverStep.name?.trim() ?? "",
      actionTakerType,
      actionTakerManagementHierarchyRows:
        normalizeManagementHierarchyRows(serverStep),
      actionTakerSpecificProcedureRows: normalizeSpecificProcedureRows(serverStep),
      branchId: serverStep.branch_id ? String(serverStep.branch_id) : "",
      managementId: serverStep.management_id
        ? String(serverStep.management_id)
        : "",
      actionTakerId: firstActionTakerUserId(serverStep),
      concernedUserId: firstConcernedUserId(serverStep),
      orgBase: base.length ? base : ["approve"],
      orgTemplate:
        actionTakerType === "himself" ? "approve" : "approve",
      notifications,
      deadlineDays: String(serverStep.approval_within_days || 0),
      deadlineHours: String(serverStep.approval_within_hours || 0),
      escalationUserId: serverStep.escalation_management_hierarchy_id ?? "",
    };
  }
  return {
    stepName: "",
    actionTakerType: "specific_user",
    actionTakerManagementHierarchyRows: [{ type: "", isDeputyDirector: false }],
    actionTakerSpecificProcedureRows: [{ type: "", id: "" }],
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
  const { t, tStepCard: ts, tc } = useProceduresSettingsTranslations();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!serverStep);
  const [isExpanded, setIsExpanded] = useState(!serverStep);
  const [skippingPeriod, setSkippingPeriod] = useState(
    () => String(serverStep?.skipping_period ?? 0),
  );

  const { control, handleSubmit, reset, watch } =
    useForm<StepFormData>({
      defaultValues: getDefaultValues(serverStep),
    });

  const stepName = watch("stepName");
  const actionTakerType = watch("actionTakerType");
  const actionTakerSpecificProcedureRows = watch(
    "actionTakerSpecificProcedureRows",
  );
  const branchId = watch("branchId");
  const actionTakerIdW = watch("actionTakerId");
  const concernedUserIdW = watch("concernedUserId");
  const fieldsDisabled = !!serverStep && !isEditing;

  const syncFromServer = useCallback(() => {
    reset(getDefaultValues(serverStep));
    setSkippingPeriod(String(serverStep?.skipping_period ?? 0));
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

  const specificProcedureTypes = useMemo(
    () => actionTakerSpecificProcedureRows.map((r) => r.type),
    [actionTakerSpecificProcedureRows],
  );

  const { data: allManagements = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["managements", "hierarchy", "management", "all"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=management`,
      ),
    enabled:
      actionTakerType === "specific_procedures" &&
      specificProcedureTypes.includes("management"),
  });

  const { data: jobTitles = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["job-titles", "list"],
    queryFn: () => fetchNamedListOptions(`${baseURL}/job_titles/list`),
    enabled:
      actionTakerType === "specific_procedures" &&
      specificProcedureTypes.includes("job_title"),
  });
 
  const jobRoleOptions = useMemo(
    () =>
      JOB_ROLE_OPTION_DEFS.map((r) => ({
        id: r.id,
        name: ts(`options.${r.labelKey}`),
      })),
    [ts],
  );

  const orgBaseOptions = useMemo(
    () =>
      ORG_BASE_OPTION_DEFS.map((o) => ({
        value: o.value,
        label: ts(`options.${o.labelKey}`),
        disabled: "disabled" in o ? o.disabled : undefined,
      })),
    [ts],
  );

  const orgTemplateOptions = useMemo(
    () =>
      ORG_TEMPLATE_OPTION_DEFS.map((o) => ({
        value: o.value,
        label: ts(`options.${o.labelKey}`),
      })),
    [ts],
  );

  const notificationOptions = useMemo(
    () =>
      NOTIFICATION_OPTION_DEFS.map((o) => ({
        value: o.value,
        label: ts(`options.${o.labelKey}`),
      })),
    [ts],
  );

  const actionTakerTypeOptions = useMemo(
    () =>
      ACTION_TAKER_TYPE_OPTION_DEFS.map((o) => ({
        value: o.value,
        label: ts(`options.${o.labelKey}`),
      })),
    [ts],
  );

  const branchSelectOptions = useMemo(
    () =>
      withEmptyOption(
        branches.map((b) => ({ value: String(b.id), label: b.name })),
        ts("selectBranch"),
      ),
    [branches, ts],
  );

  const managementSelectOptions = useMemo(
    () =>
      withEmptyOption(
        managements.map((m) => ({ value: String(m.id), label: m.name })),
        ts("selectManagement"),
      ),
    [managements, ts],
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
    return withEmptyOption(rows, ts("actionTaker"));
  }, [employeeRows, serverStep, ts]);

  const concernedUserSelectOptions = useMemo(() => {
    let rows = [...managementRows];
    if (serverStep) {
      const id = firstConcernedUserId(serverStep);
      const name = resolveConcernedUserName(serverStep, id);
      if (id) rows = ensureSelectedEmployeeRow(rows, id, name);
    }
    return withEmptyOption(rows, ts("concernedUsers"));
  }, [managementRows, serverStep, ts]);

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
    () => withEmptyOption(managementRows, ts("selectEscalationEntity")),
    [managementRows, ts],
  );

  const orgTemplateSelectOptions = useMemo(
    () => orgTemplateOptions,
    [orgTemplateOptions],
  );

  const managementHierarchySelectOptions = useMemo(
    () =>
      MANAGEMENT_HIERARCHY_TYPE_OPTION_DEFS.map((o) => ({
        value: o.value,
        label: ts(`options.${o.labelKey}`),
      })),
    [ts],
  );

  const specificProcedureEntityOptions = useMemo(
    () =>
      SPECIFIC_PROCEDURE_ENTITY_OPTION_DEFS.map((o) => ({
        value: o.value,
        label: ts(`options.${o.labelKey}`),
      })),
    [ts],
  );

  const getSpecificProcedureValueOptions = useCallback(
    (type: string) => {
      const toOptions = (rows: ManagementHierarchyOption[], placeholder: string) =>
        withEmptyOption(
          rows.map((r) => ({ value: String(r.id), label: r.name })),
          placeholder,
        );
      switch (type) {
        case "branch":
          return toOptions(branches, ts("selectBranch"));
        case "management":
          return toOptions(allManagements, ts("selectManagement"));
        case "job_title":
          return toOptions(jobTitles, ts("selectJobTitle"));
        case "job_role":
          return toOptions(jobRoleOptions, ts("selectJobRole"));
        default:
          return withEmptyOption([], tc("select"));
      }
    },
    [branches, allManagements, jobTitles, jobRoleOptions, ts, tc],
  );

  const getSpecificProcedureValuePlaceholder = useCallback(
    (type: string) => {
      switch (type) {
        case "branch": return ts("selectBranch");
        case "management": return ts("selectManagement");
        case "job_title": return ts("selectJobTitle");
        case "job_role": return ts("selectJobRole");
        default: return ts("selectValue");
      }
    },
    [ts],
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
      !data.actionTakerManagementHierarchyRows.some((row) => row.type)
    ) {
      toast({
        title: t("actions.save"),
        description: ts("validation.selectManagementHierarchy"),
        variant: "destructive",
      });
      return;
    }
    if (data.actionTakerType === "specific_procedures") {
      const validRows = data.actionTakerSpecificProcedureRows.filter(
        (r) => r.type && r.id,
      );
      if (validRows.length === 0) {
        toast({
          title: t("actions.save"),
          description: ts("validation.selectProcedureType"),
          variant: "destructive",
        });
        return;
      }
    }
    if (
      data.orgBase.includes("approve_timed") &&
      (!skippingPeriod.trim() || Number(skippingPeriod) <= 0)
    ) {
      toast({
        title: t("actions.save"),
        description: ts("validation.enterSkippingPeriod"),
        variant: "destructive",
      });
      return;
    }

    const validSpecificRows = data.actionTakerSpecificProcedureRows.filter(
      (r) => r.type && r.id,
    );
    const formsValue =
      data.actionTakerType === "himself" ? "approve" : "approve";

    const validManagementHierarchyRows = data.actionTakerManagementHierarchyRows.filter(
      (row) => row.type,
    );
    const body: CreateStepArgs = {
      name: data.stepName.trim(),
      action_taker_type: data.actionTakerType,
      ...(data.actionTakerType === "management_hierarchy" &&
      validManagementHierarchyRows.length > 0
        ? {
            action_taker_management_hierarchies:
              validManagementHierarchyRows.map((row) => ({
                action_taker_management_hierarchy_type: row.type,
                is_Deputy_Director: row.isDeputyDirector,
              })),
          }
        : {}),
      ...(data.actionTakerType === "specific_procedures" && validSpecificRows.length > 0
        ? {
            action_taker_specific_procedure_type: validSpecificRows.map((r) => r.type),
            action_taker_specific_procedure_id: validSpecificRows.map((r) => r.id),
          }
        : {}),
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
      forms: formsValue,
      notify_by_email: data.notifications.includes("email"),
      notify_by_whatsapp: data.notifications.includes("whatsapp"),
      notify_by_sms: data.notifications.includes("sms"),
      notify_by_push: data.notifications.includes("push"),
      notify_by_voice: data.notifications.includes("voice"),
      ...(data.branchId ? { branch_id: Number(data.branchId) } : {}),
      ...(data.managementId
        ? { management_id: Number(data.managementId) }
        : {}),
      ...(data.escalationUserId
        ? { escalation_management_hierarchy_id: data.escalationUserId }
        : {}),
      approval_within_days: Number(data.deadlineDays) || 0,
      approval_within_hours: Number(data.deadlineHours) || 0,
      ...(data.orgBase.includes("approve_timed")
        ? { skipping_period: Number(skippingPeriod) || 0 }
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
    inlineInput,
  }: {
    options: readonly { value: string; label: string; disabled?: boolean }[];
    selected: string[];
    onToggle: (val: string) => void;
    inlineInput?: {
      optionValue: string;
      value: string;
      onChange: (value: string) => void;
    };
  }) => (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 0.5,
      }}
    >
      {options.map((opt) => {
        const showInlineInput =
          inlineInput?.optionValue === opt.value &&
          selected.includes(opt.value);

        return (
          <FormControlLabel
            key={opt.value}
            labelPlacement="end"
            label={
              showInlineInput ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>{opt.label}</span>
                  <TextField
                    type="number"
                    size="small"
                    value={inlineInput.value}
                    onChange={(e) => inlineInput.onChange(e.target.value)}
                    disabled={fieldsDisabled}
                    sx={{ width: 80 }}
                    inputProps={{ min: 1, style: { textAlign: "center" } }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </Box>
              ) : (
                opt.label
              )
            }
            control={
              <Checkbox
                size="small"
                checked={selected.includes(opt.value)}
                onChange={() => onToggle(opt.value)}
                disabled={fieldsDisabled || opt.disabled}
              />
            }
            sx={
              opt.disabled
                ? { opacity: 0.6, cursor: "not-allowed" }
                : undefined
            }
          />
        );
      })}
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
          <SectionLabel>{ts("actionTakerType")}</SectionLabel>
          <Controller
            name="actionTakerType"
            control={control}
            render={({ field }) => (
              <Box sx={{ width: "100%" }}>
                <SearchableSelect
                  options={actionTakerTypeOptions}
                  value={field.value ?? "specific_user"}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder={ts("selectActionTakerType")}
                  searchPlaceholder={tc("search")}
                  noResultsText={tc("noResults")}
                  disabled={fieldsDisabled}
                />
              </Box>
            )}
          />
        </Box>

        {/* ── نوع الهيكل التنظيمي (conditional) ── */}
        {actionTakerType === "management_hierarchy" && (
          <Box sx={{ mb: 2.5 }}>
            <SectionLabel>{ts("managementHierarchyType")}</SectionLabel>
            <Controller
              name="actionTakerManagementHierarchyRows"
              control={control}
              render={({ field }) => {
                const rows: ManagementHierarchyRow[] = field.value?.length
                  ? field.value
                  : [{ type: "", isDeputyDirector: false }];
                const maxRows = MANAGEMENT_HIERARCHY_TYPE_OPTION_DEFS.length;
                const getRowOptions = (idx: number) => {
                  const selectedElsewhere = rows
                    .filter((_, i) => i !== idx)
                    .map((r) => r.type)
                    .filter(Boolean);
                  return managementHierarchySelectOptions.filter(
                    (option) =>
                      option.value === rows[idx]?.type ||
                      !selectedElsewhere.includes(option.value),
                  );
                };
                const canAddRow = rows.length < maxRows;
                const updateRow = (
                  idx: number,
                  key: keyof ManagementHierarchyRow,
                  val: string | boolean,
                ) => {
                  const next = rows.map((row, i) =>
                    i === idx ? { ...row, [key]: val } : row,
                  );
                  field.onChange(next);
                };
                const addRow = () => {
                  if (!canAddRow) return;
                  field.onChange([...rows, { type: "", isDeputyDirector: false }]);
                };
                const removeRow = (idx: number) =>
                  field.onChange(rows.filter((_, i) => i !== idx));

                return (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {rows.map((row, idx) => (
                      <Grid container spacing={2} key={idx} alignItems="center">
                        <Grid size={5}>
                          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                            {ts("options.actionTakerType.managementHierarchy")}
                          </Typography>
                          <SearchableSelect
                            options={getRowOptions(idx)}
                            value={row.type}
                            onChange={(v) => updateRow(idx, "type", String(v))}
                            placeholder={ts("selectManagementHierarchy")}
                            searchPlaceholder={tc("search")}
                            noResultsText={tc("noResults")}
                            disabled={fieldsDisabled}
                          />
                        </Grid>
                        <Grid size={3}>
                          <FormControlLabel
                            sx={{ m: 0, mt: 3.5 }}
                            control={
                              <Checkbox
                                checked={row.isDeputyDirector}
                                onChange={(e) =>
                                  updateRow(idx, "isDeputyDirector", e.target.checked)
                                }
                                disabled={fieldsDisabled}
                              />
                            }
                            label={ts("options.managementHierarchy.deputyManager")}
                          />
                        </Grid>
                        {!fieldsDisabled && (
                          <Grid size={4}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                mt: 3.5,
                              }}
                            >
                              {idx === rows.length - 1 && canAddRow && (
                                <Box
                                  component="span"
                                  role="button"
                                  tabIndex={0}
                                  onClick={addRow}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      addRow();
                                    }
                                  }}
                                  sx={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    border: 1,
                                    borderColor: "primary.main",
                                    color: "primary.main",
                                    fontSize: "0.8rem",
                                    cursor: "pointer",
                                    userSelect: "none",
                                    "&:hover": { bgcolor: "action.hover" },
                                  }}
                                >
                                  <Add fontSize="small" />
                                  {ts("addSpecificProcedureRow")}
                                </Box>
                              )}
                              {rows.length > 1 && (
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => removeRow(idx)}
                                  aria-label={ts("removeSpecificProcedureRow")}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    ))}
                  </Box>
                );
              }}
            />
          </Box>
        )}

        {/* ── الوحدة التنظيمية — 2-column grid of dropdowns (only show if specific_user) ── */}
        {actionTakerType === "specific_user" && (
          <Box sx={{ mb: 2.5 }}>
            <SectionLabel>{ts("organizationalUnit")}</SectionLabel>
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
                        placeholder={ts("selectBranch")}
                        searchPlaceholder={tc("search")}
                        noResultsText={tc("noResults")}
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
                        placeholder={ts("selectManagement")}
                        searchPlaceholder={tc("search")}
                        noResultsText={tc("noResults")}
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
                          placeholder={ts("actionTaker")}
                          searchPlaceholder={tc("searchManagement")}
                          noResultsText={tc("noResults")}
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
                        placeholder={ts("concernedUsers")}
                        searchPlaceholder={tc("searchManagement")}
                        noResultsText={tc("noResults")}
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

        {actionTakerType === "specific_procedures" && (
          <Box sx={{ mb: 2.5 }}>
            <SectionLabel>{ts("specificProcedures")}</SectionLabel>
            <Controller
              name="actionTakerSpecificProcedureRows"
              control={control}
              render={({ field }) => {
                const rows: SpecificProcedureRow[] =
                  field.value?.length ? field.value : [{ type: "", id: "" }];
                const updateRow = (
                  idx: number,
                  key: keyof SpecificProcedureRow,
                  val: string,
                ) => {
                  const next = rows.map((r, i) =>
                    i === idx ? { ...r, [key]: val, ...(key === "type" ? { id: "" } : {}) } : r,
                  );
                  field.onChange(next);
                };
                const addRow = () =>
                  field.onChange([...rows, { type: "", id: "" }]);
                const removeRow = (idx: number) =>
                  field.onChange(rows.filter((_, i) => i !== idx));

                return (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    {rows.map((row, idx) => (
                      <Grid container spacing={2} key={idx} alignItems="center">
                        <Grid size={5}>
                          <SearchableSelect
                            options={specificProcedureEntityOptions}
                            value={row.type}
                            onChange={(v) => updateRow(idx, "type", String(v))}
                            placeholder={ts("selectType")}
                            searchPlaceholder={tc("search")}
                            noResultsText={tc("noResults")}
                            disabled={fieldsDisabled}
                          />
                        </Grid>
                        <Grid size={5}>
                          <SearchableSelect
                            options={getSpecificProcedureValueOptions(row.type)}
                            value={row.id}
                            onChange={(v) => updateRow(idx, "id", String(v))}
                            placeholder={getSpecificProcedureValuePlaceholder(row.type)}
                            searchPlaceholder={tc("search")}
                            noResultsText={tc("noResults")}
                            disabled={fieldsDisabled || !row.type}
                          />
                        </Grid>
                        {!fieldsDisabled && rows.length > 1 && (
                          <Grid size={2}>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => removeRow(idx)}
                              aria-label={ts("removeSpecificProcedureRow")}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Grid>
                        )}
                      </Grid>
                    ))}
                    {!fieldsDisabled && (
                      <Box>
                        <Box
                          component="span"
                          role="button"
                          tabIndex={0}
                          onClick={addRow}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              addRow();
                            }
                          }}
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            border: 1,
                            borderColor: "primary.main",
                            color: "primary.main",
                            fontSize: "0.8rem",
                            cursor: "pointer",
                            userSelect: "none",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          <Add fontSize="small" />
                          {ts("addSpecificProcedureRow")}
                        </Box>
                      </Box>
                    )}
                  </Box>
                );
              }}
            />
          </Box>
        )}

        {/* ── القاعدة التنظيمية — checkboxes ── */}
        <Box sx={{ mb: 2.5 }}>
          <SectionLabel>{ts("orgRule")}</SectionLabel>
          <Controller
            name="orgBase"
            control={control}
            render={({ field }) => (
              <CheckRow
                options={orgBaseOptions}
                selected={field.value}
                onToggle={(v) =>
                  field.onChange(toggleArrayValue(field.value, v))
                }
                inlineInput={{
                  optionValue: "approve_timed",
                  value: skippingPeriod,
                  onChange: setSkippingPeriod,
                }}
              />
            )}
          />
        </Box>

        {/* ── النماذج التنظيمية — dropdown ── */}
        <Box sx={{ mb: 2.5 }}>
          <SectionLabel>{ts("orgTemplates")}</SectionLabel>
          <Controller
            name="orgTemplate"
            control={control}
            render={({ field }) => {
              const isHimselfOrAssigned =
                actionTakerType === "himself" || actionTakerType === "assigned_user";
              const availableTemplateOptions = isHimselfOrAssigned
                ? orgTemplateSelectOptions.filter((o) => o.value === "approve")
                : orgTemplateSelectOptions;
              const selectedTemplateValue = isHimselfOrAssigned
                ? "approve"
                : (field.value ?? "approve");
              const selectedTemplateLabel = availableTemplateOptions.find(
                (option) => option.value === selectedTemplateValue,
              )?.label;

              if (isHimselfOrAssigned && field.value !== "approve") {
                field.onChange("approve");
              }

              return (
                <Box sx={{ width: "100%" }}>
                  <SearchableSelect
                    options={availableTemplateOptions}
                    value={selectedTemplateValue}
                    onChange={(v) => field.onChange(String(v))}
                    placeholder={ts("selectTemplate")}
                    searchPlaceholder={tc("search")}
                    noResultsText={tc("noResults")}
                    disabled={fieldsDisabled || isHimselfOrAssigned}
                    displayLabel={
                      fieldsDisabled ? selectedTemplateLabel : undefined
                    }
                  />
                </Box>
              );
            }}
          />
        </Box>

        {/* ── الاعلامات — checkboxes ── */}
        <Box sx={{ mb: 2.5 }}>
          <SectionLabel>{ts("notifications")}</SectionLabel>
          <Controller
            name="notifications"
            control={control}
            render={({ field }) => (
              <CheckRow
                options={notificationOptions}
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
            {ts("escalation")}
          </Typography>

          {/* المهلة الزمنية inside التصعيد */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              {ts("timeLimit")}
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
                <Typography variant="body2">{tc("days")}</Typography>
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
                <Typography variant="body2">{tc("hours")}</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* الجهة المصعد إليها */}
          <Box>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              {ts("escalationEntity")}
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
                      placeholder={ts("selectEscalationEntity")}
                      searchPlaceholder={tc("searchManagement")}
                      noResultsText={tc("noResults")}
                      disabled={fieldsDisabled}
                    />
                  </Box>
                  {field.value && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block", textAlign: "end" }}
                    >
                      {ts("escalationEntitySelectedHint")}
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
