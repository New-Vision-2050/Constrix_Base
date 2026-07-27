import { baseApi } from "@/config/axios/instances/base";
import type { ListProjectSafetyResponse } from "./types";
import {
  buildSafetyVisitsListParams,
  type SafetyVisitsListParams,
} from "./args";

export type { SafetyVisitsListParams } from "./args";

export const ProjectSafetyVisitsApi = {
  listForProject: (
    projectId: string | number,
    params?: SafetyVisitsListParams,
  ) =>
    baseApi.get<ListProjectSafetyResponse>(`projects/${projectId}/safety`, {
      params: buildSafetyVisitsListParams(params ?? {}),
    }),
};
