/**
 * Website Service parameters for update
 */
export interface UpdateWebsiteServiceParams {
  id: string;
}

/**
 * Department parameters for update
 */
export interface UpdateOurServiceDepartmentParams {
  title: string;
  description: string;
  type: "hexa" | "cards";
  services: UpdateWebsiteServiceParams[];
}

/**
 * Parameters for updating Our Services
 */
export interface UpdateOurServicesParams {
  title: string;
  description: string;
  departments: UpdateOurServiceDepartmentParams[];
}

