import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectRequirementArgs,
  CreateProjectRequirementsArgs,
  ListProjectRequirementsParams,
} from "./types/params";
import type {
  CreateProjectRequirementsResponse,
  ListProjectRequirementsResponse,
} from "./types/response";

export const ProjectRequirementsApi = {
  listForProject: (
    projectId: string | number,
    params?: ListProjectRequirementsParams,
  ) =>
    baseApi.get<ListProjectRequirementsResponse>(
      `projects/${projectId}/requirements`,
      { params },
    ),

  createForProject: (
    projectId: string | number,
    body: CreateProjectRequirementsArgs | CreateProjectRequirementArgs,
  ) =>
    baseApi.post<CreateProjectRequirementsResponse>(
      `projects/${projectId}/requirements`,
      body,
    ),
};
