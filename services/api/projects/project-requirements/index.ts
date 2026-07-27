import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectRequirementArgs,
  CreateProjectRequirementsArgs,
  ListProjectRequirementsParams,
} from "./types/params";
import type {
  CreateProjectRequirementSubmissionResponse,
  CreateProjectRequirementsResponse,
  GetProjectRequirementResponse,
  ListProjectRequirementSubmissionsResponse,
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

  getForProject: (
    projectId: string | number,
    requirementId: string | number,
  ) =>
    baseApi.get<GetProjectRequirementResponse>(
      `projects/${projectId}/requirements/${requirementId}`,
    ),

  createForProject: (
    projectId: string | number,
    body: CreateProjectRequirementsArgs | CreateProjectRequirementArgs,
  ) =>
    baseApi.post<CreateProjectRequirementsResponse>(
      `projects/${projectId}/requirements`,
      body,
    ),

  /** POST multipart/form-data with `files[]` only. */
  createSubmission: (
    projectId: string | number,
    requirementId: string | number,
    files: File[],
  ) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files[]", file));
    return baseApi.post<CreateProjectRequirementSubmissionResponse>(
      `projects/${projectId}/requirements/${requirementId}/submissions`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  listSubmissions: (
    projectId: string | number,
    requirementId: string | number,
  ) =>
    baseApi.get<ListProjectRequirementSubmissionsResponse>(
      `projects/${projectId}/requirements/${requirementId}/submissions`,
    ),
};
