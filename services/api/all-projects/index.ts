import { apiClient, baseURL } from "@/config/axios-config";

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
  manager_id?: number | null;
  management_id: number;
  status: number;
  project_owner_type?: "company" | "individual";
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export const AllProjectsApi = {
  list: (params?: ProjectParams) =>
    apiClient.get(`${baseURL}/projects`, { params }),

  show: (id: number) => apiClient.get(`${baseURL}/projects/${id}`),

  create: (data: CreateProjectData) =>
    apiClient.post(`${baseURL}/projects`, data),

  update: (id: number, data: UpdateProjectData) =>
    apiClient.put(`${baseURL}/projects/${id}`, data),

  delete: (id: number) => apiClient.delete(`${baseURL}/projects/${id}`),

  getProjectTypes: () => apiClient.get(`${baseURL}/project-types/roots`),

  getSubProjectTypes: (projectTypeId: number) =>
    apiClient.get(`${baseURL}/project-types/${projectTypeId}/children`),

  getBranches: () =>
    apiClient.get(`${baseURL}/management_hierarchies/list?type=branch`),

  getManagements: () =>
    apiClient.get(`${baseURL}/management_hierarchies/list?type=management`),

  getCompanyUsers: () => apiClient.get(`${baseURL}/company-users`),

  getEntityClients: (params?: { name?: string }) =>
    apiClient.get(`${baseURL}/companies/clients`, { params }),

  getIndividualClients: (params?: { name?: string }) =>
    apiClient.get(`${baseURL}/company-users/clients`, { params }),
};
