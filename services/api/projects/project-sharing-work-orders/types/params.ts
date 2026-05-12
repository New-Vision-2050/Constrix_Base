export interface CreateProjectSharingWorkOrderPayload {
  project_type_id: number;
  code: string;
  description: string;
  type: string;
}

export interface UpdateProjectSharingWorkOrderPayload {
  code: string;
  description: string;
  type: string;
}
