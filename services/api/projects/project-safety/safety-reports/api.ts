import { baseApi } from "@/config/axios/instances/base";
import type { ListProjectSafetyReportsResponse } from "./types";

export const ProjectSafetyReportsApi = {
  listForProject: (projectId: string | number) =>
    baseApi.get<ListProjectSafetyReportsResponse>(
      `projects/${projectId}/safety/report`,
    ),
};
