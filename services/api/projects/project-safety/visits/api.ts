import { baseApi } from "@/config/axios/instances/base";
import type { ListProjectSafetyResponse } from "./types";

export const ProjectSafetyVisitsApi = {
  listForProject: (projectId: string | number) =>
    baseApi.get<ListProjectSafetyResponse>(`projects/${projectId}/safety`),
};
