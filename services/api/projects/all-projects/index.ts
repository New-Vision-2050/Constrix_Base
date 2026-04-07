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
    baseApi.get<GetBranchesResponse>("management_hierarchies/list?type=branch", { params }),

  getManagements: (params?: { name?: string; branch_id?: number }) =>
    baseApi.get<GetManagementsResponse>(
      "management_hierarchies/list?type=management",
      { params }
    ),

  getCompanyUsers: (params?: { name?: string; per_page?: number }) => 
    baseApi.get(`company-users/employees`, { params }),

  getEntityClients: (params?: ClientParams) =>
    baseApi.get<GetClientsResponse>("companies/clients", { params }),

  getIndividualClients: (params?: ClientParams) =>
    baseApi.get<GetClientsResponse>("company-users/clients", { params }),

  getProjectDetails: (projectId: string) =>
    baseApi.get<ShowProjectResponse>(`projects/${projectId}`),
};
