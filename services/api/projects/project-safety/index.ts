import { baseApi } from "@/config/axios/instances/base";
import type { ListProjectSafetyResponse } from "./types/response";

export const ProjectSafetyApi = {
  listForProject: (projectId: string | number) =>
    baseApi.get<ListProjectSafetyResponse>(`projects/${projectId}/safety`),
};

export type {
  ProjectSafetyRecordDto,
  ProjectSafetyViolationDto,
} from "./types/response";
