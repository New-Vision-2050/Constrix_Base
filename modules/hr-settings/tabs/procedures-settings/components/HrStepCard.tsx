"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
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
import { CreateStepArgs } from "@/services/api/crm-settings/procedure-settings/types/args";
import { useToast } from "@/modules/table/hooks/use-toast";
import SearchableSelect from "@/components/shared/SearchableSelect";
import MultiSelect from "@/components/shared/MultiSelect";
import { withEmptyOption } from "@/modules/hr-settings/tabs/procedures-settings/utils/selectOptions";
import { REPORT_TYPE_OPTIONS } from "@/modules/hr-reports/attendance/components/report-wizard/constants-step1";

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const hours = i + 1;
  return { value: String(hours), label: `${hours}` };
});

interface HrStepCardProps {
  procedureSettingId: string;
  serverStep: ProcedureStep | null;
  stepIndex?: number;
  onSaved: () => void;
  onDelete: () => void;
}

interface HrStepFormData {
  stepName: string;
  branchId: string;
  managementId: string;
  actionTakerId: string;
  concernedUserId: string;
  employeeIds: string[];
  reportTypeIds: string[];
  deadlineHours: string;
  escalationDurationHours: string;
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

function resolveUserName(
  step: ProcedureStep | null,
  userId: string,
  source: "action" | "concerned",
): string {
  if (!step || !userId) return "";
  const idStr = String(userId);
  if (source === "action") {
    const hit = step.action_takers?.find(
      (at) => at.user?.id != null && String(at.user.id) === idStr,
    );
    return (
      hit?.user?.name?.trim() ||
      (String(step.employee_id) === idStr ? step.employee?.name?.trim() : "") ||
      ""
    );
  }
  const hit = step.concerned_users?.find(
    (cu) => cu.user?.id != null && String(cu.user.id) === idStr,
  );
  return hit?.user?.name?.trim() || "";
}

const getDefaultValues = (serverStep: ProcedureStep | null): HrStepFormData => {
  if (serverStep) {
    const employeeIds = [
      ...(serverStep.action_taker_user_ids ?? []).map(String),
      ...(serverStep.concerned_management_hierarchy_ids ?? [])
        .slice(1)
        .map(String),
    ].filter((id, idx, arr) => id && arr.indexOf(id) === idx);

    return {
      stepName: serverStep.name?.trim() ?? "",
      branchId: serverStep.branch_id ? String(serverStep.branch_id) : "",
      managementId: serverStep.management_id
        ? String(serverStep.management_id)
        : "",
      actionTakerId: firstActionTakerUserId(serverStep),
      concernedUserId: firstConcernedUserId(serverStep),
      employeeIds,
      reportTypeIds: (serverStep.report_type_ids ?? []).map(String),
      deadlineHours: String(serverStep.approval_within_hours || 6),
      escalationDurationHours: String(serverStep.duration || 12),
    };
  }

  return {
    stepName: "",
    branchId: "",
    managementId: "",
    actionTakerId: "",
    concernedUserId: "",
    employeeIds: [],
    reportTypeIds: [],
    deadlineHours: "6",
    escalationDurationHours: "12",
  };
};

export default function HrStepCard({
  procedureSettingId,
  serverStep,
  stepIndex = 1,
  onSaved,
  onDelete,
}: HrStepCardProps) {
  const t = useTranslations("hr-settings.proceduresSettings");
  const ts = useTranslations("hr-settings.proceduresSettings.stepCard");
  const tc = useTranslations("hr-settings.proceduresSettings.common");
  const tReportTypes = useTranslations(
    "HRReports.attendanceReport.wizard.reportTypes",
  );
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!serverStep);
  const [isExpanded, setIsExpanded] = useState(!serverStep);

  const { control, handleSubmit, reset, watch } = useForm<HrStepFormData>({
    defaultValues: getDefaultValues(serverStep),
  });

  const stepName = watch("stepName");
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

  const employeeMultiOptions = useMemo(
    () => employeesData.map((e) => ({ id: String(e.id), name: e.name })),
    [employeesData],
  );

  const reportTypeOptions = useMemo(
    () =>
      REPORT_TYPE_OPTIONS.map((opt) => ({
        id: opt.id,
        name: tReportTypes(opt.id),
      })),
    [tReportTypes],
  );

  const hourSelectOptions = useMemo(
    () =>
      HOUR_OPTIONS.map((opt) => ({
        value: opt.value,
        label: `${opt.label} ${tc("hour")}`,
      })),
    [tc],
  );

  const actionTakerSelectOptions = useMemo(
    () => withEmptyOption(employeeRows, ts("actionTaker")),
    [employeeRows, ts],
  );

  const concernedUserSelectOptions = useMemo(
    () =>
      withEmptyOption(
        employeeRows,
        ts("concernedUsers"),
      ),
    [employeeRows, ts],
  );

  const actionTakerDisplayLabel = useMemo(() => {
    if (!fieldsDisabled || !actionTakerIdW) return undefined;
    const id = String(actionTakerIdW);
    const fromApi = serverStep ? resolveUserName(serverStep, id, "action") : "";
    const fromList =
      employeeRows.find((r) => String(r.value) === id)?.label ?? "";
    return (fromApi || fromList).trim() || id;
  }, [fieldsDisabled, actionTakerIdW, serverStep, employeeRows]);

  const concernedUserDisplayLabel = useMemo(() => {
    if (!fieldsDisabled || !concernedUserIdW) return undefined;
    const id = String(concernedUserIdW);
    const fromApi = serverStep
      ? resolveUserName(serverStep, id, "concerned")
      : "";
    const fromList =
      employeeRows.find((r) => String(r.value) === id)?.label ?? "";
    return (fromApi || fromList).trim() || id;
  }, [fieldsDisabled, concernedUserIdW, serverStep, employeeRows]);

  const loadStepForEdit = async () => {
    if (!serverStep) return;
    try {
      const res = await ProcedureSettingsApi.getStep(
        procedureSettingId,
        serverStep.id,
      );
      const stepData = res?.data?.payload || res?.data || res;
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
      // keep existing form data
    }
  };

  const onSubmit = async (data: HrStepFormData) => {
    if (!data.actionTakerId) {
      toast({
        title: t("actions.save"),
        description: t("steps.selectEmployee"),
        variant: "destructive",
      });
      return;
    }

    const body: CreateStepArgs = {
      name: data.stepName.trim() || `${t("steps.stage")} ${stepIndex}`,
      action_taker_type: "specific_user",
      action_taker_user_ids: data.actionTakerId ? [data.actionTakerId] : [],
      concerned_management_hierarchy_ids: [
        ...(data.concernedUserId ? [data.concernedUserId] : []),
        ...data.employeeIds.filter((id) => id !== data.concernedUserId),
      ],
      is_accept: false,
      is_approve: true,
      is_view_only: false,
      is_return_with_notes: false,
      requires_approval_within_period: false,
      forms: "approve",
      approval_within_days: 0,
      approval_within_hours: Number(data.deadlineHours) || 0,
      duration: Number(data.escalationDurationHours) || 0,
      report_type_ids: data.reportTypeIds,
      notify_by_email: false,
      notify_by_whatsapp: false,
      notify_by_sms: false,
      ...(data.branchId ? { branch_id: Number(data.branchId) } : {}),
      ...(data.managementId
        ? { management_id: Number(data.managementId) }
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
        setIsEditing(false);
        setIsExpanded(false);
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

  const actionButtonSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    px: 1.5,
    py: 0.5,
    borderRadius: 1,
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: isSaving ? "not-allowed" : "pointer",
    opacity: isSaving ? 0.5 : 1,
    userSelect: "none" as const,
    outline: "none",
  };

  return (
    <Accordion
      expanded={isExpanded}
      onChange={(_, expanded) => setIsExpanded(expanded)}
      disableGutters
      sx={{
        border: isExpanded ? "1px solid" : "1px solid transparent",
        borderColor: isExpanded ? "info.main" : "transparent",
        borderRadius: 1,
        mb: 1,
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        sx={{
          flexDirection: "row-reverse",
          px: 1.5,
          py: 0.5,
          mt: 1,
          "& .MuiAccordionSummary-content": {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            margin: 0,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1 }}>
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

        <Box
          sx={{ display: "flex", gap: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!isEditing ? (
            <Box
              component="span"
              role="button"
              tabIndex={0}
              onClick={async (e) => {
                e.stopPropagation();
                await loadStepForEdit();
                setIsEditing(true);
                setIsExpanded(true);
              }}
              sx={{
                ...actionButtonSx,
                border: 1,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
              }}
            >
              <Edit fontSize="small" />
              {t("actions.edit")}
            </Box>
          ) : (
            <>
              <Box
                component="span"
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isSaving) handleSubmit(onSubmit)();
                }}
                sx={{
                  ...actionButtonSx,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                {t("actions.save")}
              </Box>
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
                  sx={{
                    ...actionButtonSx,
                    border: 1,
                    borderColor: "divider",
                    color: "text.primary",
                    "&:hover": {
                      borderColor: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  {t("actions.cancel")}
                </Box>
              )}
            </>
          )}
          <Box
            component="span"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              if (isSaving) return;
              e.stopPropagation();
              onDelete();
            }}
            sx={{
              ...actionButtonSx,
              border: 1,
              borderColor: "error.main",
              color: "error.main",
              "&:hover": { bgcolor: "error.lighter" },
            }}
          >
            <Delete fontSize="small" />
            {t("actions.delete")}
          </Box>
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ p: 2.5 }}>
        <Grid container spacing={2}>
          <Grid size={6}>
            <Controller
              name="branchId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={branchSelectOptions}
                  value={field.value ?? ""}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder={ts("selectBranch")}
                  searchPlaceholder={tc("search")}
                  noResultsText={tc("noResults")}
                  disabled={fieldsDisabled}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="managementId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={managementSelectOptions}
                  value={field.value ?? ""}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder={ts("selectManagement")}
                  searchPlaceholder={tc("search")}
                  noResultsText={tc("noResults")}
                  disabled={fieldsDisabled || !branchId}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="actionTakerId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={actionTakerSelectOptions}
                  value={field.value ?? ""}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder={ts("actionTaker")}
                  searchPlaceholder={tc("search")}
                  noResultsText={tc("noResults")}
                  disabled={fieldsDisabled}
                  displayLabel={
                    fieldsDisabled ? actionTakerDisplayLabel : undefined
                  }
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="concernedUserId"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={concernedUserSelectOptions}
                  value={field.value ?? ""}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder={ts("concernedUsers")}
                  searchPlaceholder={tc("search")}
                  noResultsText={tc("noResults")}
                  disabled={fieldsDisabled}
                  displayLabel={
                    fieldsDisabled ? concernedUserDisplayLabel : undefined
                  }
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="employeeIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={employeeMultiOptions}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder={ts("selectEmployees")}
                  searchPlaceholder={tc("search")}
                  disabled={fieldsDisabled}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="reportTypeIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  options={reportTypeOptions}
                  value={field.value ?? []}
                  onChange={field.onChange}
                  placeholder={ts("selectReportTypes")}
                  searchPlaceholder={tc("search")}
                  disabled={fieldsDisabled}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="deadlineHours"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={hourSelectOptions}
                  value={field.value ?? "6"}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder={ts("timeLimit")}
                  searchPlaceholder={tc("search")}
                  noResultsText={tc("noResults")}
                  disabled={fieldsDisabled}
                />
              )}
            />
          </Grid>
          <Grid size={6}>
            <Controller
              name="escalationDurationHours"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  options={hourSelectOptions}
                  value={field.value ?? "12"}
                  onChange={(v) => field.onChange(String(v))}
                  placeholder={ts("escalationDuration")}
                  searchPlaceholder={tc("search")}
                  noResultsText={tc("noResults")}
                  disabled={fieldsDisabled}
                />
              )}
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
