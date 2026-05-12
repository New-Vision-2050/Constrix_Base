export interface CreateProjectSharingDepartmentPayload {
  project_type_id: number;
  code: string;
  description: string;
}

export interface UpdateProjectSharingDepartmentPayload {
  code: string;
  description: string;
}
