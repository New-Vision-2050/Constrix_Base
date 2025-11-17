/**
 * Project interface for company dashboard
 * Represents a project entity with all its properties
 */
export interface CompanyDashboardProject {
  id: string;
  title_ar?: string;
  title_en?: string;
  name_ar?: string;
  name_en?: string;
  type?: string;
  description_ar?: string;
  description_en?: string;
  is_featured?: boolean;
  main_image?: string;
  sub_images?: string[];
  details?: ProjectDetail[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Project detail interface
 * Represents a single detail entry in a project
 */
export interface ProjectDetail {
  id?: string;
  detail_ar: string;
  detail_en?: string;
  service_id: string;
}

