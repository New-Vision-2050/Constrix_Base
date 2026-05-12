/** Single work order returned by list/show/update APIs */
export interface ProjectSharingWorkOrderPayload {
  id: number;
  project_type_id: number;
  code: string;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface ListProjectSharingWorkOrdersResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingWorkOrderPayload[];
}

export interface GetProjectSharingWorkOrderResponse {
  code: string;
  message: string | null;
  payload: ProjectSharingWorkOrderPayload;
}

export interface MutateProjectSharingWorkOrderResponse {
  code: string;
  message: string | null;
  payload?: ProjectSharingWorkOrderPayload;
}
