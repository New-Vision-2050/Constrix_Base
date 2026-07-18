import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectManagementArgs,
  UpdateProjectManagementArgs,
} from "./types/args";
import type {
  CreateProjectManagementResponse,
  DeleteProjectManagementResponse,
  GetProjectManagementResponse,
  ListProjectManagementsResponse,
  UpdateProjectManagementResponse,
} from "./types/response";

export const ProjectManagementsApi = {
  list: () =>
    baseApi.get<ListProjectManagementsResponse>("project-managements"),

  get: (id: number | string) =>
    baseApi.get<GetProjectManagementResponse>(
      `project-managements/${id}`,
    ),

  create: (body: CreateProjectManagementArgs) =>
    baseApi.post<CreateProjectManagementResponse>(
      "project-managements",
      body,
    ),

  update: (id: number | string, body: UpdateProjectManagementArgs) =>
    baseApi.put<UpdateProjectManagementResponse>(
      `project-managements/${id}`,
      body,
    ),

  delete: (id: number | string) =>
    baseApi.delete<DeleteProjectManagementResponse>(
      `project-managements/${id}`,
    ),
};
