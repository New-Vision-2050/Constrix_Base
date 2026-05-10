import { baseApi } from "@/config/axios/instances/base";
import type {
  CreateProjectSharingDepartmentPayload,
  UpdateProjectSharingDepartmentPayload,
} from "./types/params";
import type {
  GetProjectSharingDepartmentResponse,
  ListProjectSharingDepartmentsResponse,
  MutateProjectSharingDepartmentResponse,
} from "./types/response";

export const ProjectSharingDepartmentApi = {
  list: (projectTypeId: number | string) =>
    baseApi.get<ListProjectSharingDepartmentsResponse>(
      "project-sharing-department",
      { params: { project_type_id: projectTypeId } },
    ),

  show: (departmentId: number | string) =>
    baseApi.get<GetProjectSharingDepartmentResponse>(
      `project-sharing-department/${departmentId}`,
    ),

  create: (body: CreateProjectSharingDepartmentPayload) =>
    baseApi.post<MutateProjectSharingDepartmentResponse>(
      "project-sharing-department",
      body,
    ),

  update: (
    departmentId: number | string,
    body: UpdateProjectSharingDepartmentPayload,
  ) =>
    baseApi.put<MutateProjectSharingDepartmentResponse>(
      `project-sharing-department/${departmentId}`,
      body,
    ),

  delete: (departmentId: number | string) =>
    baseApi.delete<MutateProjectSharingDepartmentResponse>(
      `project-sharing-department/${departmentId}`,
    ),
};
