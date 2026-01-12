/**
 * Translation interface for translatable fields
 */
export interface Translation {
  id: number;
  locale: "ar" | "en";
  translatable_type: string;
  translatable_id: string;
  field: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

/**
 * Project detail interface
 * Represents a single detail entry in a project
 */
export interface ProjectDetail {
  id: string;
  name_ar?: string;
  name_en?: string;
  website_project_id: string;
  website_service_id: string;
  created_at?: string;
  updated_at?: string;
  translations?: Translation[];
}

/**
 * Service pivot interface
 */
export interface ServicePivot {
  website_project_id: string;
  website_service_id: string;
  id: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Website Service interface
 */
export interface WebsiteService {
  id: string;
  category_website_cms_id: string;
  reference_number?: string;
  company_id: string;
  status: number;
  created_at?: string;
  updated_at?: string;
  pivot?: ServicePivot;
  translations?: Translation[];
}

/**
 * Project interface for company dashboard
 * Represents a project entity with all its properties
 */
export interface CMSProject {
  id: string;
  website_project_setting_id?: string;
  title?: string;
  title_ar?: string;
  title_en?: string;
  name?: string;
  name_ar?: string;
  name_en?: string;
  description?: string;
  description_ar?: string;
  description_en?: string;
  status?: number;
  main_image?: string;
  secondary_images?: string[];
  project_details?: ProjectDetail[];
  services?: WebsiteService[];
  created_at?: string;
  updated_at?: string;
}

export interface CMSProjectType {
  id: string;
  name_ar: string;
  name_en: string;
  projects_count: number;
}
