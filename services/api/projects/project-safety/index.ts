import { baseApi } from "@/config/axios/instances/base";
import type { ListProjectSafetyResponse } from "./types/response";
import type { ListProjectSafetyReportsResponse } from "./types/report-response";

export const ProjectSafetyApi = {
  listForProject: (projectId: string | number) =>
    baseApi.get<ListProjectSafetyResponse>(`projects/${projectId}/safety`),

  listReportsForProject: (projectId: string | number) =>
    baseApi.get<ListProjectSafetyReportsResponse>(
      `projects/${projectId}/safety-reports`,
    ),
};

export type {
  ProjectSafetyRecordDto,
  ProjectSafetyViolationDto,
} from "./types/response";
