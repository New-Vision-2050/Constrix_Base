import { ApiBaseResponse } from "@/types/common/response/base";

export interface ProjectContractorRepresentativeDto {
  id?: string | number;
  name?: string | null;
  mobile?: string | null;
  nationality?: string | null;
}

export interface ProjectContractorDto {
  id: string | number;
  name?: string | null;
  contractor_name?: string | null;
  type?: string | null;
  contractor_type?: string | null;
  activity?: string | null;
  commercial_register?: string | null;
  commercialRegister?: string | null;
  tax_id?: string | null;
  tax_card?: string | null;
  mobile?: string | null;
  phone?: string | null;
  email?: string | null;
  primary_contact?: string | null;
  project_manager?: string | null;
  manager_name?: string | null;
  classification?: string | null;
  status?: string | number | boolean | null;
  is_active?: boolean | number | null;
  country_id?: string | number | null;
  country?: { id?: string | number | null; name?: string | null } | null;
  project_contractor_id?: string | null;
  project_manager_name?: string | null;
  project_manager_phone?: string | null;
  project_manager_nationality?: string | null;
  project_manager_email?: string | null;
  representatives?: ProjectContractorRepresentativeDto[] | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ListProjectContractorsResponse extends ApiBaseResponse<
  ProjectContractorDto[]
> {}

export interface GetProjectContractorResponse extends ApiBaseResponse<ProjectContractorDto> {}

export interface DeleteProjectContractorResponse extends ApiBaseResponse<null> {}

export interface CreateProjectContractorResponse extends ApiBaseResponse<ProjectContractorDto> {}

export interface UpdateProjectContractorResponse extends ApiBaseResponse<ProjectContractorDto> {}
