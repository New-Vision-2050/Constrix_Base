import { PRJ_ProjectType } from "@/types/api/projects/project-type";
import { ApiBaseResponse } from "@/types/common/response/base";

export interface GetRootsProjectTypesResponse extends ApiBaseResponse<
  PRJ_ProjectType[]
> {}

export interface GetDirectChildrenProjectTypesResponse extends ApiBaseResponse<
  PRJ_ProjectType[]
> {}

export interface GetProjectTypeSchemasResponse extends ApiBaseResponse<
  PRJ_ProjectType[]
> {}

export interface CreateSecondLevelProjectTypeResponse extends ApiBaseResponse<PRJ_ProjectType> {}

export interface CreateThirdLevelProjectTypeResponse extends ApiBaseResponse<PRJ_ProjectType> {}

export interface DataSettings {
  id: number;
  project_type_id: number;
  is_reference_number: boolean;
  is_name_project: boolean;
  is_client: boolean;
  is_responsible_engineer: boolean;
  is_number_contract: boolean;
  is_central_cost: boolean;
  is_project_value: boolean;
  is_start_date: boolean;
  is_achievement_percentage: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetDataSettingsResponse extends ApiBaseResponse<DataSettings> {}

export interface UpdateDataSettingsResponse extends ApiBaseResponse<DataSettings> {}
