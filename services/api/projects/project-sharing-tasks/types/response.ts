export interface ProjectSharingTaskPayload {
  id: number;
  project_type_id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ListProjectSharingTasksResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingTaskPayload[];
}

export interface GetProjectSharingTaskResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingTaskPayload;
}

export interface MutateProjectSharingTaskResponse {
  code: string;
  message: string | null;
  payload?: ProjectSharingTaskPayload;
}
