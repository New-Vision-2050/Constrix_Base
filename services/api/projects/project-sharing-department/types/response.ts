export interface ProjectSharingDepartmentPayload {
  id: number;
  project_type_id: number;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ListProjectSharingDepartmentsResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingDepartmentPayload[];
}

export interface GetProjectSharingDepartmentResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingDepartmentPayload;
}

export interface MutateProjectSharingDepartmentResponse {
  code: string;
  message: string | null;
  payload?: ProjectSharingDepartmentPayload;
}
