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
      "order-permit-departments",
      { params: { project_type_id: projectTypeId } },
    ),

  show: (departmentId: number | string) =>
    baseApi.get<GetProjectSharingDepartmentResponse>(
      `order-permit-departments/${departmentId}`,
    ),

  create: (body: CreateProjectSharingDepartmentPayload) =>
    baseApi.post<MutateProjectSharingDepartmentResponse>(
      "order-permit-departments",
      body,
    ),

  update: (
    departmentId: number | string,
    body: UpdateProjectSharingDepartmentPayload,
  ) =>
    baseApi.put<MutateProjectSharingDepartmentResponse>(
      `order-permit-departments/${departmentId}`,
      body,
    ),

  delete: (departmentId: number | string) =>
    baseApi.delete<MutateProjectSharingDepartmentResponse>(
      `order-permit-departments/${departmentId}`,
    ),
};
