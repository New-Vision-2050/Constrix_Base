export interface ProjectParams {
  page?: number;
  per_page?: number;
  name?: string;
  status?: string;
  project_type_id?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
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

export interface ClientParams {
  name?: string;
}
