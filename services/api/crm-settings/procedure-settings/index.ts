import { baseApi } from "@/config/axios/instances/base";
import { CreateStageArgs, UpdateStageArgs, CreateStepArgs } from "./types/args";
import { GetStagesResponse, GetStepsResponse } from "./types/response";

export const ProcedureSettingsApi = {
  getStages: (type: string, branchId?: number) => {
    const params = new URLSearchParams({ type });
    if (branchId != null) {
      params.append("branch_id", String(branchId));
    }
    return baseApi.get<GetStagesResponse>(`procedure-settings?${params}`);
  },
  createStage: (args: CreateStageArgs) =>
    baseApi.post<GetStagesResponse>("procedure-settings", args),
  updateStage: (stageId: string, args: UpdateStageArgs) =>
    baseApi.put<GetStagesResponse>(`procedure-settings/${stageId}`, args),
  deleteStage: (stageId: string) =>
    baseApi.delete(`procedure-settings/${stageId}`),

  // Work flows API
  getWorkFlows: () => baseApi.get("procedure-settings/work_flows"),
  updateWorkFlow: (branchId: number, checked: boolean, type: string) =>
    baseApi.post("procedure-settings/work_flows", {
      branch_id: branchId,
      checked,
      type,
    }),

  // Procedure steps API
  getSteps: (procedureSettingId: string) =>
    baseApi.get<GetStepsResponse>(
      `procedure-settings/${procedureSettingId}/steps`,
    ),
  getStep: (procedureSettingId: string, stepId: number) =>
    baseApi.get(`procedure-settings/${procedureSettingId}/steps/${stepId}`),
  createStep: (procedureSettingId: string, args: CreateStepArgs) =>
    baseApi.post(`procedure-settings/${procedureSettingId}/steps`, args),
  updateStep: (
    procedureSettingId: string,
    stepId: number,
    args: CreateStepArgs,
  ) =>
    baseApi.put(
      `procedure-settings/${procedureSettingId}/steps/${stepId}`,
      args,
    ),
  deleteStep: (procedureSettingId: string, stepId: number) =>
    baseApi.delete(`procedure-settings/${procedureSettingId}/steps/${stepId}`),
};
