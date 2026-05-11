export interface CreateProjectSharingTaskSettingPayload {
  project_type_id: number;
  project_sharing_work_order_id: number;
  project_sharing_task_id: number;
}

export interface UpdateProjectSharingTaskSettingPayload {
  project_sharing_work_order_id: number;
  project_sharing_task_id: number;
}
