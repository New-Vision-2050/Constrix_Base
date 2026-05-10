export interface CreateProjectSharingProcedurePayload {
  project_type_id: number;
  code: string;
  description: string;
}

export interface UpdateProjectSharingProcedurePayload {
  code: string;
  description: string;
}
