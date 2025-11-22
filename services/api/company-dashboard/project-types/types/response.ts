import { CMSProjectType } from "@/modules/content-management-system/projects/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface CompanyDashboardProjectType extends CMSProjectType {}

export interface ListProjectTypesResponse
  extends ApiPaginatedResponse<CompanyDashboardProjectType[]> {}

export interface ShowProjectTypeResponse
  extends ApiBaseResponse<CompanyDashboardProjectType> {}

