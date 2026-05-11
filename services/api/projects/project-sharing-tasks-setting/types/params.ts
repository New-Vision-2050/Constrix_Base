export interface CreateProjectSharingTaskSettingPayload {
  project_type_id: number;
  order_permit_id: number;
  order_permit_task_id: number;
}

export interface UpdateProjectSharingTaskSettingPayload {
  order_permit_id: number;
  order_permit_task_id: number;
}
