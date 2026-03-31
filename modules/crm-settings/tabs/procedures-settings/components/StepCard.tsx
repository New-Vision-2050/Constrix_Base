"use client";

import {
  Button,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useState, useEffect, useCallback } from "react";
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

interface StepFormData {
  stepName: string;
  employee_id: string;
  is_accept: boolean;
  is_approve: boolean;
  duration: number;
  forms: string;
  relevantDepartment: string;
}

function mapFormsFromApi(step: ProcedureStep): string {
  return formsKindToStepCardUi(parseProcedureStepFormsKind(step));
}

function formFromServerStep(step: ProcedureStep): StepFormData {
  const deptId =
    step.management_id != null && String(step.management_id).length > 0
      ? String(step.management_id)
      : "hr";
  return {
    stepName: step.name?.trim() ? String(step.name) : "",
    employee_id: step.employee_id ?? "",
    is_accept: coerceStepBoolean(step.is_accept),
    is_approve: coerceStepBoolean(step.is_approve),
    duration: step.duration,
    forms: mapFormsFromApi(step),
    relevantDepartment: deptId,
  };
}

const emptyForm = (): StepFormData => ({
  stepName: "",
  employee_id: "",
  is_accept: false,
  is_approve: false,
  duration: 0,
  forms: "approve",
  relevantDepartment: "hr",
});

interface StepCardProps {
  procedureSettingId: string;
  serverStep: ProcedureStep | null;
  onSaved: () => void;
  onDelete: () => void;
}

export default function StepCard({
  procedureSettingId,
  serverStep,
  onSaved,
  onDelete,
}: StepCardProps) {
  const t = useTranslations("CRMSettingsModule.proceduresSettings");
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  /** Saved steps start locked until user clicks Edit; new drafts are always editable. */
  const [isEditing, setIsEditing] = useState(!serverStep);

  const [formData, setFormData] = useState<StepFormData>(emptyForm);

  const syncFormFromServer = useCallback(() => {
    if (serverStep) {
      setFormData(formFromServerStep(serverStep));
    } else {
      setFormData(emptyForm());
    }
  }, [serverStep]);

  useEffect(() => {
    if (serverStep) {
      setIsEditing(false);
      setFormData(formFromServerStep(serverStep));
    } else {
      setIsEditing(true);
      setFormData(emptyForm());
    }
  }, [serverStep]);

  const isNewDraft = !serverStep;
  const fieldsDisabled = !isNewDraft && !isEditing;

  const handleChange = (
    field: keyof StepFormData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => {
      const next =
        field === "employee_id" ||
        field === "forms" ||
        field === "relevantDepartment" ||
        field === "stepName"
          ? { ...prev, [field]: typeof value === "string" ? value : "" }
          : { ...prev, [field]: value };
      return next;
    });
  };

  const { data: employeesData = [] } = useQuery<EmployeeOption[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await apiClient.get("/company-users/employees");
      return response.data.payload || response.data;
    },
  });

  const { data: managements = [] } = useQuery<ManagementHierarchyOption[]>({
    queryKey: ["managements", "hierarchy", "management"],
    queryFn: () =>
      fetchManagementHierarchyOptions(
        `${baseURL}/management_hierarchies/list?type=management`,
      ),
  });

  const handleSave = async () => {
    if (!formData.employee_id) {
      toast({
        title: t("actions.save"),
        description: t("steps.selectEmployee"),
        variant: "destructive",
      });
      return;
    }

    const nameTrimmed = formData.stepName.trim();
    const deptId = formData.relevantDepartment ?? "hr";
    const body: CreateStepArgs = {
      employee_id: formData.employee_id,
      is_accept: formData.is_accept,
      is_approve: formData.is_approve,
      duration: Number(formData.duration) || 0,
      forms: formData.forms,
      ...(nameTrimmed ? { name: nameTrimmed } : {}),
      ...(deptId !== "hr"
        ? (() => {
            const m = managements.find((row) => row.id === deptId);
            return {
              management_id: deptId,
              ...(m?.name ? { management_name: m.name } : {}),
            };
          })()
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

  const handleCancelEdit = () => {
    syncFormFromServer();
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <div className="flex items-center justify-between mb-3">
        <TextField
          size="small"
          placeholder={t("steps.enterStepName")}
          value={formData.stepName}
          onChange={(e) => handleChange("stepName", e.target.value)}
          disabled={fieldsDisabled}
          sx={{ minWidth: 250 }}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="small"
            color="error"
            startIcon={<Delete />}
            onClick={onDelete}
          >
            {t("actions.delete")}
          </Button>
          {serverStep ? (
            isEditing ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  {t("actions.cancel")}
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {t("actions.save")}
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                onClick={handleStartEdit}
              >
                {t("actions.edit")}
              </Button>
            )
          ) : (
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              disabled={isSaving}
            >
              {t("actions.save")}
            </Button>
          )}
        </div>
      </div>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t("procedures.employee")}</TableCell>
              <TableCell>{t("procedures.approval")}</TableCell>
              <TableCell>{t("procedures.accreditation")}</TableCell>
              <TableCell>{t("procedures.exceedDuration")}</TableCell>
              <TableCell>{t("procedures.template")}</TableCell>
              <TableCell>{t("procedures.relevantDepartment")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Select
                  size="small"
                  value={formData.employee_id ?? ""}
                  onChange={(e) =>
                    handleChange("employee_id", e.target.value)
                  }
                  displayEmpty
                  disabled={fieldsDisabled}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="">{t("steps.selectEmployee")}</MenuItem>
                  {employeesData.map((emp) => (
                    <MenuItem key={emp.id} value={String(emp.id ?? "")}>
                      {emp.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={formData.is_approve}
                  onChange={(e) =>
                    handleChange("is_approve", e.target.checked)
                  }
                  disabled={fieldsDisabled}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={formData.is_accept}
                  onChange={(e) =>
                    handleChange("is_accept", e.target.checked)
                  }
                  disabled={fieldsDisabled}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <TextField
                    size="small"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      handleChange(
                        "duration",
                        parseInt(e.target.value, 10) || 0,
                      )
                    }
                    disabled={fieldsDisabled}
                    sx={{ width: 80 }}
                  />
                  <span>{t("procedures.hour")}</span>
                </div>
              </TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={formData.forms ?? "approve"}
                  onChange={(e) => handleChange("forms", e.target.value)}
                  disabled={fieldsDisabled}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="approve">
                    {t("procedures.accreditationType.approval")}
                  </MenuItem>
                  <MenuItem value="financial">
                    {t("procedures.accreditationType.financial")}
                  </MenuItem>
                  <MenuItem value="accept">
                    {t("procedures.accreditationType.accreditation")}
                  </MenuItem>
                </Select>
              </TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={formData.relevantDepartment ?? "hr"}
                  onChange={(e) =>
                    handleChange("relevantDepartment", e.target.value)
                  }
                  disabled={fieldsDisabled}
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="hr">
                    {t("procedures.humanResources")}
                  </MenuItem>
                  {managements.map((m) => (
                    <MenuItem key={m.id} value={m.id}>
                      {m.name}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
