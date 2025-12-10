/**
 * Parameters for updating Homepage Settings
 */
export interface UpdateHomepageSettingsParams {
  web_video_file?: File | null;
  web_video_link?: string | null;
  mobile_video_file?: File | null;
  mobile_video_link?: string | null;
  video_profile_file?: File | null;
  description_ar?: string | null;
  description_en?: string | null;
  is_companies?: 0 | 1;
  is_approvals?: 0 | 1;
  is_certificates?: 0 | 1;
}
