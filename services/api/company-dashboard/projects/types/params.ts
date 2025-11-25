/**
 * Parameters for creating a new project
 * Follows the project form schema structure
 */
export interface CreateProjectParams {
  is_featured?: boolean;
  main_image?: File | null;
  sub_images?: File[];
  "title[ar]": string;
  "title[en]"?: string;
  type: string;
  "name[ar]": string;
  "name[en]"?: string;
  "description[ar]": string;
  "description[en]"?: string;
  details?: ProjectDetailParams[];
}

/**
 * Parameters for updating an existing project
 * All fields are optional for partial updates
 */
export interface UpdateProjectParams {
  is_featured?: boolean;
  main_image?: File | null;
  sub_images?: File[];
  "title[ar]"?: string;
  "title[en]"?: string;
  type?: string;
  "name[ar]"?: string;
  "name[en]"?: string;
  "description[ar]"?: string;
  "description[en]"?: string;
  details?: ProjectDetailParams[];
}

/**
 * Project detail parameters
 * Used in create/update project requests
 */
export interface ProjectDetailParams {
  detail_ar: string;
  detail_en?: string;
  service_id: string;
}

