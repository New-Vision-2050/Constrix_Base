import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectSharingTaskPayload,
  UpdateProjectSharingTaskPayload,
} from "./types/params";
import type {
  GetProjectSharingTaskResponse,
  ListProjectSharingTasksResponse,
  MutateProjectSharingTaskResponse,
} from "./types/response";

export const ProjectSharingTasksApi = {
  list: (projectTypeId: number | string) =>
    baseApi.get<ListProjectSharingTasksResponse>("project-sharing-tasks", {
      params: { project_type_id: projectTypeId },
    }),

  show: (taskId: number | string) =>
    baseApi.get<GetProjectSharingTaskResponse>(
      `project-sharing-tasks/${taskId}`,
    ),

  create: (body: CreateProjectSharingTaskPayload) =>
    baseApi.post<MutateProjectSharingTaskResponse>(
      "project-sharing-tasks",
      body,
    ),

  update: (taskId: number | string, body: UpdateProjectSharingTaskPayload) =>
    baseApi.put<MutateProjectSharingTaskResponse>(
      `project-sharing-tasks/${taskId}`,
      body,
    ),

  delete: (taskId: number | string) =>
    baseApi.delete<MutateProjectSharingTaskResponse>(
      `project-sharing-tasks/${taskId}`,
    ),
};
