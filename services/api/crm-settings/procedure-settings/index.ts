import { baseApi } from "@/config/axios/instances/base";
import { CreateStageArgs, UpdateStageArgs, CreateStepArgs } from "./types/args";
import { GetStagesResponse, GetStepsResponse } from "./types/response";

export const ProcedureSettingsApi = {
  getStages: () => baseApi.get<GetStagesResponse>("procedure-settings"),
  createStage: (args: CreateStageArgs) =>
    baseApi.post<GetStagesResponse>("procedure-settings", args),
  updateStage: (stageId: string, args: UpdateStageArgs) =>
    baseApi.put<GetStagesResponse>(`procedure-settings/${stageId}`, args),
  deleteStage: (stageId: string) =>
    baseApi.delete(`procedure-settings/${stageId}`),

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
