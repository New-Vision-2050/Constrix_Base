import { ApiBaseResponse } from "@/types/common/response/base";

export interface ProjectManagementDto {
  id: number;
  project_id: string | null;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ListProjectManagementsResponse
  extends ApiBaseResponse<ProjectManagementDto[]> {}

export interface GetProjectManagementResponse
  extends ApiBaseResponse<ProjectManagementDto> {}

export interface CreateProjectManagementResponse
  extends ApiBaseResponse<ProjectManagementDto> {}

export interface UpdateProjectManagementResponse
  extends ApiBaseResponse<ProjectManagementDto> {}

export interface DeleteProjectManagementResponse
  extends ApiBaseResponse<null> {}
