"use client";

import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Select,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, baseURL } from "@/config/axios-config";
import {
  fetchManagementHierarchyOptions,
  type ManagementHierarchyOption,
} from "@/utils/fetchDropdownOptions";
import { ProcedureSettingsApi } from "@/services/api/crm-settings/procedure-settings";
import { ProcedureStep } from "@/services/api/crm-settings/procedure-settings/types/response";
import { CreateStepArgs } from "@/services/api/crm-settings/procedure-settings/types/args";
import { useToast } from "@/modules/table/hooks/use-toast";

interface EmployeeOption {
  id: string;
  name: string;
  email: string;
}

interface Procedure {
  id?: number;
  employee_id: string;
  is_accept: boolean;
  is_approve: boolean;
  duration: number;
  forms: string;
  relevantDepartment: string;
}

interface ProceduresTableProps {
  stageId: string;
  stageName: string;
}

export interface ProceduresTableRef {
  getProceduresData: () => Procedure[];
  submitAllProcedures: () => Promise<void>;
  addNewProcedure: () => void;
  handleAddAndSubmitProcedure: (procedureData: {
    employee_id: string;
    is_accept: boolean;
    is_approve: boolean;
    duration: number;
    forms: string;
  }) => Promise<void>;
}

const ProceduresTable = forwardRef<ProceduresTableRef, ProceduresTableProps>(
  ({ stageId, stageName: _stageName }, ref) => {
    void _stageName; // Reserved for future use
    const t = useTranslations("CRMSettingsModule.proceduresSettings");
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [procedures, setProcedures] = useState<Procedure[]>([
      {
        employee_id: "",
        is_accept: false,
        is_approve: false,
        duration: 0,
        forms: "approval",
        relevantDepartment: "hr",
      },
    ]);

    // Fetch procedure steps from API
    const { data: stepsData } = useQuery({
      queryKey: ["procedure-steps", stageId],
      queryFn: () => ProcedureSettingsApi.getSteps(stageId),
      enabled: !!stageId,
    });

    // Update procedures when API data is loaded
    useEffect(() => {
      if (stepsData?.payload) {
        const apiProcedures = stepsData.payload.map((step: ProcedureStep) => ({
          id: step.id,
          employee_id: step.employee_id,
          is_accept: step.is_accept,
          is_approve: step.is_approve,
          duration: step.duration,
          forms: step.forms.approve
            ? "approval"
            : step.forms.financial
              ? "financial"
              : "accept",
          relevantDepartment: "hr", // Default value, can be updated based on API
        }));
        setProcedures(apiProcedures);
      }
    }, [stepsData]);

    const handleFieldChange = (
      index: number,
      field: keyof Procedure,
      value: string | number | boolean,
    ) => {
      setProcedures(
        procedures.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
      );
    };

    const submitAllProcedures = async () => {
      const validProcedures = procedures.filter(
        (p) => p.employee_id && p.employee_id !== "",
      );

      for (const procedure of validProcedures) {
        const stepData: CreateStepArgs = {
          employee_id: procedure.employee_id,
          is_accept: procedure.is_accept,
          is_approve: procedure.is_approve,
          duration: procedure.duration,
          forms: procedure.forms,
        };

        try {
          await ProcedureSettingsApi.createStep(stageId, stepData);
        } catch (error) {
          console.error("Error submitting procedure:", error);
          throw error;
        }
      }
    };

    const addNewProcedure = () => {
      const newProcedure: Procedure = {
        employee_id: "",
        is_accept: false,
        is_approve: false,
        duration: 0,
        forms: "approval",
        relevantDepartment: "hr",
      };
      setProcedures([...procedures, newProcedure]);
    };

    const handleAddAndSubmitProcedure = async (procedureData: {
      employee_id: string;
      is_accept: boolean;
      is_approve: boolean;
      duration: number;
      forms: string;
    }) => {
      // Validate required fields
      if (!procedureData.employee_id) {
        toast({
          title: t("actions.add"),
          description: "Please select an employee.",
          variant: "destructive",
        });
        return;
      }

      const stepData: CreateStepArgs = {
        employee_id: procedureData.employee_id,
        is_accept: procedureData.is_accept,
        is_approve: procedureData.is_approve,
        duration: procedureData.duration,
        forms: procedureData.forms,
      };

      try {
        await ProcedureSettingsApi.createStep(stageId, stepData);
        toast({
          title: t("actions.add"),
          description: t("messages.procedureAdded"),
          variant: "default",
        });
        queryClient.invalidateQueries({
          queryKey: ["procedure-steps", stageId],
        });
      } catch (error) {
        console.error("Error adding procedure:", error);
        toast({
          title: t("actions.add"),
          description: t("messages.error"),
          variant: "destructive",
        });
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      getProceduresData: () => procedures,
      submitAllProcedures,
      addNewProcedure,
      handleAddAndSubmitProcedure,
    }));

    const [employeeSearchText] = useState("");

    const { data: employeesData = [] } = useQuery<EmployeeOption[]>({
      queryKey: ["employees", employeeSearchText],
      queryFn: async () => {
        const response = await apiClient.get("/company-users/employees", {
          params: employeeSearchText ? { name: employeeSearchText } : undefined,
        });
        return response.data.payload || response.data;
      },
    });
    // Fetch managements for dropdown
    const { data: managements = [] } = useQuery<ManagementHierarchyOption[]>({
      queryKey: ["managements", "hierarchy", "management"],
      queryFn: () =>
        fetchManagementHierarchyOptions(
          `${baseURL}/management_hierarchies/list?type=management`,
        ),
    });

    return (
      <div className="space-y-4">
        <div className="mb-4">
          <Typography variant="h6" fontWeight={500}>
            {t("procedures.title") || "Procedures"}
          </Typography>
        </div>
        <TableContainer sx={{ backgroundColor: "transparent" }}>
          <Table>
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
              {procedures.map((procedure, index) => (
                <TableRow key={procedure.id || index}>
                  <TableCell>
                    <Select
                      size="small"
                      value={procedure.employee_id || ""}
                      onChange={(e) =>
                        handleFieldChange(index, "employee_id", e.target.value)
                      }
                      displayEmpty
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="">اختر اسم الموظف</MenuItem>
                      {employeesData.map((employee) => (
                        <MenuItem key={employee.id} value={employee.id}>
                          {employee.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={procedure.is_approve || false}
                      onChange={(e) =>
                        handleFieldChange(index, "is_approve", e.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={procedure.is_accept || false}
                      onChange={(e) =>
                        handleFieldChange(index, "is_accept", e.target.checked)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TextField
                        size="small"
                        type="number"
                        value={procedure.duration || 0}
                        onChange={(e) =>
                          handleFieldChange(
                            index,
                            "duration",
                            parseInt(e.target.value) || 0,
                          )
                        }
                        sx={{ width: 80 }}
                      />
                      <span>{t("procedures.hour")}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={procedure.forms || "approval"}
                      onChange={(e) =>
                        handleFieldChange(index, "forms", e.target.value)
                      }
                      sx={{ minWidth: 120 }}
                    >
                      <MenuItem value="approval">
                        {t("procedures.accreditationType.approval")}
                      </MenuItem>
                      <MenuItem value="financial">
                        {t("procedures.accreditationType.financial")}
                      </MenuItem>
                      <MenuItem value="accreditation">
                        {t("procedures.accreditationType.accreditation")}
                      </MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={procedure.relevantDepartment || "hr"}
                      onChange={(e) =>
                        handleFieldChange(
                          index,
                          "relevantDepartment",
                          e.target.value,
                        )
                      }
                      sx={{ minWidth: 150 }}
                    >
                      <MenuItem value="hr">
                        {t("procedures.humanResources")}
                      </MenuItem>
                      {managements.map((management) => (
                        <MenuItem key={management.id} value={management.id}>
                          {management.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  },
);

ProceduresTable.displayName = "ProceduresTable";

export default ProceduresTable;
