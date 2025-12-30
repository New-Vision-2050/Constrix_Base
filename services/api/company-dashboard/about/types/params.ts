/**
 * Project Type parameters for About Us update
 */
export interface UpdateAboutProjectTypeParams {
  title_ar: string;
  title_en: string;
  count: number;
}

/**
 * Attachment parameters for About Us update
 */
export interface UpdateAboutAttachmentParams {
  id?: string;
  name: string;
  file?: File;
}

/**
 * Parameters for updating About Us
 */
export interface UpdateAboutUsParams {
  title?: string;
  description?: string;
  is_certificates?: 0 | 1;
  is_approvals?: 0 | 1;
  is_companies?: 0 | 1;
  about_me_ar?: string;
  about_me_en?: string;
  vision_ar?: string;
  vision_en?: string;
  target_ar?: string;
  target_en?: string;
  slogan_ar?: string;
  slogan_en?: string;
  main_image?: File | null;
  project_types?: UpdateAboutProjectTypeParams[];
  attachments?: UpdateAboutAttachmentParams[];
}

