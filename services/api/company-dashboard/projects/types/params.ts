/**
 * Project detail parameters
 * Used in create/update project requests
 */
export interface ProjectDetailParams {
  name_ar: string;
  name_en: string;
  website_service_id: string;
}

/**
 * Parameters for creating a new project
 * Follows the project form schema structure
 */
export interface CreateProjectParams {
  website_project_setting_id: string;
  title_ar: string;
  title_en: string;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  main_image?: File | null;
  secondary_image?: File | null;
  project_details?: ProjectDetailParams[];
}

/**
 * Parameters for updating an existing project
 * All fields are optional for partial updates
 */
export interface UpdateProjectParams {
  website_project_setting_id?: string;
  title_ar?: string;
  title_en?: string;
  name_ar?: string;
  name_en?: string;
  description_ar?: string;
  description_en?: string;
  main_image?: File | null;
  secondary_image?: File | null;
  project_details?: ProjectDetailParams[];
}
