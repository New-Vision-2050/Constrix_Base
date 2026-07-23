import { baseApi } from "@/config/axios/instances/base";
import { CreateStageArgs, UpdateStageArgs, CreateStepArgs } from "./types/args";
import type {
  GetProcedureSettingTypesResponse,
  GetStagesResponse,
  GetStepsResponse,
  ProcedureSettingTypeDto,
} from "./types/response";

export type GetProcedureSettingTypesParams = {
  /** Optional backend filter (e.g. document / crm). */
  group?: string;
  category?: string;
  module?: string;
};

export const ProcedureSettingsApi = {
  /** Lists available procedure-setting type tabs (domains). */
  getTypes: async (
    params?: GetProcedureSettingTypesParams,
  ): Promise<ProcedureSettingTypeDto[]> => {
    const response = await baseApi.get<GetProcedureSettingTypesResponse>(
      "procedure-settings/types",
      { params },
    );
    return response.data?.payload ?? response.data?.data ?? [];
  },
  getStages: (
    typeOrOptions:
      | string
      | { type?: string; parentId?: string; branchId?: number },
    branchId?: number,
  ) => {
    let type: string | undefined;
    let parentId: string | undefined;
    let branch: number | undefined;

    if (typeof typeOrOptions === "string") {
      type = typeOrOptions;
      branch = branchId;
    } else {
      type = typeOrOptions.type;
      parentId = typeOrOptions.parentId;
      branch = typeOrOptions.branchId;
    }

    const params = new URLSearchParams();
    if (parentId) {
      params.append("parent_id", parentId);
    }
    if (type) {
      params.append("type", type);
    }
    if (branch != null) {
      params.append("branch_id", String(branch));
    }
    return baseApi.get<GetStagesResponse>(`procedure-settings?${params}`);
  },
  createStage: (args: CreateStageArgs) =>
    baseApi.post<GetStagesResponse>("procedure-settings", args),
  updateStage: (
    stageId: string,
    args: UpdateStageArgs,
    options?: { projectId?: string },
  ) =>
    baseApi.put<GetStagesResponse>(
      `procedure-settings/${stageId}`,
      args,
      options?.projectId
        ? { params: { project_id: options.projectId } }
        : undefined,
    ),
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
    baseApi.post(
      `procedure-settings/${procedureSettingId}/steps/