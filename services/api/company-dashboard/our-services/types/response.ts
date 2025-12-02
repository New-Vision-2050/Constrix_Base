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
  title: string;
  description: string;
  type: "hexa" | "cards";
  website_services: WebsiteService[];
}

/**
 * Our Services data structure
 */
export interface OurServicesData {
  id: string;
  title: string;
  description: string;
  status: 0 | 1;
  company_id: string;
  created_at: string;
  updated_at: string;
  departments: OurServiceDepartment[];
}

/**
 * Response for getting current Our Services
 */
export interface GetCurrentOurServicesResponse extends ApiBaseResponse<OurServicesData> {}

/**
 * Response for updating Our Services
 */
export interface UpdateOurServicesResponse extends ApiBaseResponse<OurServicesData> {}

