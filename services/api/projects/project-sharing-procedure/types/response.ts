export interface ProjectSharingProcedurePayload {
  id: number;
  project_type_id: number;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ListProjectSharingProceduresResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingProcedurePayload[];
}

export interface GetProjectSharingProcedureResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingProcedurePayload;
}

export interface MutateProjectSharingProcedureResponse {
  code: string;
  message: string | null;
  payload?: ProjectSharingProcedurePayload;
}
