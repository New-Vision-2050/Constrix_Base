/**
 * Department parameters for update
 */
export interface UpdateOurServiceDepartmentParams {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  type: string;
  website_service_ids: string[];
}

/**
 * Parameters for updating Our Services
 */
export interface UpdateOurServicesParams {
  title: string;
  description: string;
  status: number;
  departments: UpdateOurServiceDepartmentParams[];
}

