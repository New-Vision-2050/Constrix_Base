import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface FounderListItem {
  id: string;
  name_ar?: string;
  name_en?: string;
  name?: string;
  job_title_ar?: string;
  job_title_en?: string;
  job_title?: string;
  is_active?: "active" | "inActive";
}

export interface Founder {
  id: string;
  name_ar: string;
  name_en: string;
  job_title_ar: string;
  job_title_en: string;
  description_ar: string;
  description_en: string;
  personal_photo?: string;
}

export interface ListFoundersResponse
  extends ApiPaginatedResponse<FounderListItem[]> {}

export interface ShowFounderResponse extends ApiBaseResponse<Founder> {}
