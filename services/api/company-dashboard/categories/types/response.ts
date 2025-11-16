import { CompanyDashboardCategory } from "@/modules/company-dashboard/categories/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListCategoriesResponse
  extends ApiPaginatedResponse<CompanyDashboardCategory[]> {}

export interface ShowCategoryResponse
  extends ApiBaseResponse<CompanyDashboardCategory> {}

