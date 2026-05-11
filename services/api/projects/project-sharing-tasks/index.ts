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
    baseApi.get<ListProjectSharingTasksResponse>("order-permit-tasks", {
      params: { project_type_id: projectTypeId },
    }),

  show: (taskId: number | string) =>
    baseApi.get<GetProjectSharingTaskResponse>(`order-permit-tasks/${taskId}`),

  create: (body: CreateProjectSharingTaskPayload) =>
    baseApi.post<MutateProjectSharingTaskResponse>("order-permit-tasks", body),

  update: (taskId: number | string, body: UpdateProjectSharingTaskPayload) =>
    baseApi.put<MutateProjectSharingTaskResponse>(
      `order-permit-tasks/${taskId}`,
      body,
    ),

  delete: (taskId: number | string) =>
    baseApi.delete<MutateProjectSharingTaskResponse>(
      `order-permit-tasks/${taskId}`,
    ),
};
