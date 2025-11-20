import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";
import { CompanyDashboardCategory } from "@/modules/content-management-system/categories/types";

export interface CompanyDashboardIcon {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
  icon: string;
  category_website_cms_id: string;
  category: CompanyDashboardCategory;
}

export interface ListIconsResponse
  extends ApiPaginatedResponse<CompanyDashboardIcon[]> {}

export interface ShowIconResponse
  extends ApiBaseResponse<CompanyDashboardIcon> {}

