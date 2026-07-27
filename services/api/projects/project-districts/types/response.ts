import { ApiBaseResponse } from "@/types/common/response/base";

export interface ProjectDistrictDto {
  id: number;
  project_id: string | null;
  name: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface ListProjectDistrictsResponse
  extends ApiBaseResponse<ProjectDistrictDto[]> {}

export interface GetProjectDistrictResponse
  extends ApiBaseResponse<ProjectDistrictDto> {}

export interface CreateProjectDistrictResponse
  extends ApiBaseResponse<ProjectDistrictDto> {}

export interface UpdateProjectDistrictResponse
  extends ApiBaseResponse<ProjectDistrictDto> {}

export interface DeleteProjectDistrictResponse
  extends ApiBaseResponse<null> {}
