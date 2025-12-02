import { ApiBaseResponse } from "@/types/common/response/base";

/**
 * Website Service in Department
 */
export interface WebsiteService {
  id: string;
  name: string;
  reference_number: string;
}

/**
 * Department with services
 */
export interface OurServiceDepartment {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  type: string;
  website_services: WebsiteService[];
}

/**
 * Our Services data structure
 */
export interface OurServicesData {
  id: string;
  title: string;
  description: string;
  status: number;
  company_id: string;
  created_at: string;
  updated_at: string;
  departments: OurServiceDepartment[];
}

/**
 * Design type option
 */
export interface DesignOptionType {
  id: string;
  name: string;
  name_ar: string;
  name_en: string;
}

/**
 * Response for getting current Our Services
 */
export interface GetCurrentOurServicesResponse extends ApiBaseResponse<OurServicesData> {}

/**
 * Response for updating Our Services
 */
export interface UpdateOurServicesResponse extends ApiBaseResponse<OurServicesData> {}


/**
 * Response for getting design types list
 */
export interface GetDesignTypesResponse extends ApiBaseResponse<DesignOptionType[]> {}

