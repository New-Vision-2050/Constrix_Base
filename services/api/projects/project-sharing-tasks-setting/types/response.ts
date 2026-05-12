export interface OrderPermit {
  id: number;
  code: string;
  description: string;
  type: string;
}

export interface OrderPermitTask {
  id: number;
  code: string;
  name: string;
}

export interface ProjectSharingTaskSettingPayload {
  id: number;
  project_type_id: number;
  order_permit: OrderPermit;
  order_permit_task: OrderPermitTask;
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
