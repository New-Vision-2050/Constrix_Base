import { baseApi } from "@/config/axios/instances/base";
import {
  ProjectPermissionsTreeResponse,
  ProjectRolesListResponse,
  ProjectRoleDetailsResponse,
  ProjectRoleDeleteResponse,
} from "./types/response";
import {
  CreateProjectRoleParams,
  UpdateProjectRoleParams,
} from "./types/params";

export const ProjectRolesApi = {
  permissionsTree: () =>
    baseApi.get<ProjectPermissionsTreeResponse>("projects/permissions/tree"),

  list: (projectId: string) =>
    baseApi.get<ProjectRolesListResponse>(`projects/${projectId}/roles`),

  show: (projectId: string, roleId: string) =>
    baseApi.get<ProjectRoleDetailsResponse>(
      `projects/${projectId}/roles/${roleId}`,
    ),

  create: (projectId: string, params: CreateProjectRoleParams) =>
    baseApi.post(`projects/${projectId}/roles`, params),

  update: (
    projectId: string,
    roleId: string,
    params: UpdateProjectRoleParams,
  ) => baseApi.put(`projects/${projectId}/roles/${roleId}`, params),

  delete: (projectId: string, roleId: string) =>
    baseApi.delete<ProjectRoleDeleteResponse>(
      `projects/${projectId}/roles/${roleId}`,
    ),
};
