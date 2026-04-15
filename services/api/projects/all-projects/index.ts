import { baseApi } from "@/config/axios/instances/base";
import {
  ClientParams,
  CreateProjectData,
  ProjectParams,
  UpdateProjectData,
} from "../../all-projects/types/params";
import {
  CreateProjectResponse,
  DeleteProjectResponse,
  GetBranchesResponse,
  GetClientsResponse,
  GetManagementsResponse,
  GetEmployeesNotInProjectResponse,
  GetProjectEmployeesResponse,
  GetProjectTypesResponse,
  ListProjectsResponse,
  ShowProjectResponse,
  UpdateProjectResponse,
} from "../../all-projects/types/response";

export const AllProjectsApi = {
  list: (params?: ProjectParams) =>
    baseApi.get<ListProjectsResponse>("projects", { params }),

  show: (id: number) => baseApi.get<ShowProjectResponse>(`projects/${id}`),

  create: (data: CreateProjectData) =>
    baseApi.post<CreateProjectResponse>("projects", data),

  update: (id: number, data: UpdateProjectData) =>
    baseApi.put<UpdateProjectResponse>(`projects/${id}`, data),

  delete: (id: number) =>
    baseApi.delete<DeleteProjectResponse>(`projects/${id}`),

  getProjectTypes: () =>
    baseApi.get<GetProjectTypesResponse>("project-types/roots"),

  getSubProjectTypes: (projectTypeId: number) =>
    baseApi.get<GetProjectTypesResponse>(
      `project-types/${projectTypeId}/children`,
    ),

  getBranches: (params?: { name?: string }) =>
    baseApi.get<GetBranchesResponse>(
      "management_hierarchies/list?type=branch",
      { params },
    ),

  getManagements: (params?: { name?: string; branch_id?: number }) =>
    baseApi.get<GetManagementsResponse>(
      "management_hierarchies/list?type=management",
      { params },
    ),

  getCompanyUsers: (params?: { name?: string; per_page?: number }) =>
    baseApi.get(`company-users/employees`, { params }),

  getEntityClients: (params?: ClientParams) =>
    baseApi.get<GetClientsResponse>("companies/clients", { params }),

  getIndividualClients: (params?: ClientParams) =>
    baseApi.get<GetClientsResponse>("company-users/clients", { params }),

  getProjectDetails: (projectId: string) =>
    baseApi.get<ShowProjectResponse>(`projects/${projectId}`),

  getProjectEmployees: (projectId: string) =>
    baseApi.get<GetProjectEmployeesResponse>(
      `projects/employees/project/${projectId}`,
    ),

  getEmployeesNotInProject: (projectId: string) =>
    baseApi.get<GetEmployeesNotInProjectResponse>(
      `projects/employees/not-in-project/${projectId}`,
    ),

  assignEmployeesToProject: (data: {
    project_id: string;
    user_ids: string[];
  }) =>
    baseApi.post<{ code: string; message?: string | null }>(
      "projects/employees/assign",
      data,
    ),

  /** Removes a project–employee assignment (`payload[].id` from project employees list). */
  removeProjectEmployee: (assignmentId: string) =>
    baseApi.delete<{ code: string; message?: string | null }>(
      `projects/employees/${assignmentId}`,
    ),

  /** Assigns a project role to a project–employee row (`assignmentId` = row `id`). */
  assignProjectEmployeeRole: (
    assignmentId: string,
    data: { project_role_id: string },
  ) =>
    baseApi.put<{ code: string; message?: string | null }>(
      `projects/employees/${assignmentId}/assign-role`,
      data,
    ),
};
