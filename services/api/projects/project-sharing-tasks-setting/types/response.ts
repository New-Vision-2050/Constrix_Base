export interface ProjectSharingTaskSettingPayload {
  id: number;
  project_type_id: number;
  project_sharing_work_order_id: number;
  project_sharing_task_id: number;
  created_at: string;
  updated_at: string;
}

export interface ListProjectSharingTaskSettingsResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingTaskSettingPayload[];
}

export interface GetProjectSharingTaskSettingResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingTaskSettingPayload;
}

export interface MutateProjectSharingTaskSettingResponse {
  code: string;
  message: string | null;
  payload?: ProjectSharingTaskSettingPayload;
}
