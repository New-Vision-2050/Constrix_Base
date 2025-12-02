import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ServiceListItem {
  id: string;
  name_ar?: string;
  name_en?: string;
  name?: string;
  category?: string;
  category_name?: string;
  status?: boolean;
  is_active?: "active" | "inActive";
}

export interface Service {
  id: string;
  name_ar: string;
  name_en: string;
  request_id: string;
  category_id: string;
  description_ar: string;
  description_en: string;
  status: boolean;
  icon_image?: {
    url?: string;
  };
  main_image?: {
    url?: string;
  };
  previous_works?: Array<{
    id: string;
    description: string;
    image?: {
      url?: string;
    };
  }>;
}

export interface ListServicesResponse
  extends ApiPaginatedResponse<ServiceListItem[]> {}

export interface ShowServiceResponse extends ApiBaseResponse<Service> {}
