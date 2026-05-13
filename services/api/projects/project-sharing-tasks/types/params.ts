export interface CreateProjectSharingTaskPayload {
  project_type_id: number;
  code: string;
  name: string;
}

export interface UpdateProjectSharingTaskPayload {
  code: string;
  name: string;
}
