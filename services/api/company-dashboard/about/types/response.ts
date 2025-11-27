import { ApiBaseResponse } from "@/types/common/response/base";

/**
 * Project Type in About Us
 */
export interface AboutProjectType {
  title: LocalizedText;
  count: number;
}

/**
 * Attachment in About Us
 */
export interface AboutAttachment {
  id?: number;
  name: string;
  url?: string;
  attachment_url?: string | null;
  file?: File;
}

/**
 * Localized text (Arabic and English)
 */
export interface LocalizedText {
  ar: string;
  en: string;
}

/**
 * About Us data structure
 */
export interface AboutUsData {
  id: string;
  company_id: string;
  title: string;
  description: string;
  is_certificates: 0 | 1;
  is_approvals: 0 | 1;
  is_companies: 0 | 1;
  about_me: LocalizedText;
  vision: LocalizedText;
  target: LocalizedText;
  slogan: LocalizedText;
  status: 0 | 1;
  created_at: string;
  updated_at: string;
  main_image: string | null;
  project_types: AboutProjectType[];
  attachments: AboutAttachment[];
}

/**
 * Response for getting current About Us
 */
export interface GetCurrentAboutUsResponse extends ApiBaseResponse<AboutUsData> {}

/**
 * Response for updating About Us
 */
export interface UpdateAboutUsResponse extends ApiBaseResponse<AboutUsData> {}

