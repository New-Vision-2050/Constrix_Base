import { baseApi } from "@/config/axios/instances/base";

export interface ProjectParams {
  page?: number;
  per_page?: number;
  name?: string;
  status?: string;
  project_type_id?: string;
}

export interface CreateProjectData {
  project_type_id: number;
  sub_project_type_id: number;
  sub_sub_project_type_id?: number;
  name: string;
  responsible_employee_id?: number;
  project_owner_id?: string;
  branch_id: number;
  manager_id?: string | null;
  management_id: number;
  status: number;
  project_owner_type?: "company" | "individual";
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export const AllProjectsApi = {
  list: (params?: ProjectParams) =>
    baseApi.get("projects", { params }),

  show: (id: number) => baseApi.get(`projects/${id}`),

  create: (data: CreateProjectData) =>
    baseApi.post("projects", data),

  update: (id: number, data: UpdateProjectData) =>
    baseApi.put(`projects/${id}`, data),

  delete: (id: number) => baseApi.delete(`projects/${id}`),

  getProjectTypes: () => baseApi.get("project-types/roots"),

  getSubProjectTypes: (projectTypeId: number) =>
    baseApi.get(`project-types/${projectTypeId}/children`),

  getBranches: () =>
    baseApi.get("management_hierarchies/list?type=branch"),

  getManagements: () =>
    baseApi.get("management_hierarchies/list?type=management"),

  getCompanyUsers: () => baseApi.get("company-users"),

  getEntityClients: (params?: { name?: string }) =>
    baseApi.get("companies/clients", { params }),

  getIndividualClients: (params?: { name?: string }) =>
    baseApi.get("company-users/clients", { params }),

  getProjectDetails: (projectId: string) =>
    baseApi.get(`projects/${projectId}`),
};
