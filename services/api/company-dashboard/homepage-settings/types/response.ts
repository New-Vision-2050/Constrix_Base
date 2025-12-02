import { ApiBaseResponse } from "@/types/common/response/base";

export interface HomepageSettingsData {
  id: string;
  company_id: string;
  web_video_file: string | null;
  web_video_link: string | null;
  mobile_video_file: string | null;
  mobile_video_link: string | null;
  video_profile_file: string | null;
  description_ar: string | null;
  description_en: string | null;
  is_companies: 0 | 1;
  is_approvals: 0 | 1;
  is_certificates: 0 | 1;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
}

export interface GetCurrentHomepageSettingsResponse
  extends ApiBaseResponse<HomepageSettingsData> {}

export interface UpdateHomepageSettingsResponse
  extends ApiBaseResponse<HomepageSettingsData> {}
