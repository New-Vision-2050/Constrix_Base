import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface BE_ServiceListItem {
  id: string;
  name_ar?: string;
  name_en?: string;
  name?: string;
  category?: string;
  category_name?: string;
  status?: boolean;
  is_active?: "active" | "inActive";
}

export interface BE_Service {
  id: string;
  name?: string;
  name_ar: string;
  name_en: string;
  icon?: string;
  main_image?: string;
  category_website_cms_id: string;
  category?: {
    id: string;
    name?: string;
    name_ar?: string;
    name_en?: string;
  };
  reference_number?: string | null;
  description?: string;
  description_ar: string;
  description_en: string;
  previous_work?: Array<{
    id: string;
    description: string;
    image?: string;
  }>;
  company_id: string;
  status: number; // 0 or 1
  created_at: string;
  updated_at: string;
}

export interface ListServicesResponse
  extends ApiPaginatedResponse<BE_ServiceListItem[]> { }

export interface ShowServiceResponse extends ApiBaseResponse<BE_Service> { }
