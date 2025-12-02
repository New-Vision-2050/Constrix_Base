import { baseApi } from "@/config/axios/instances/base";
import { GetCurrentOurServicesResponse, GetDesignTypesResponse, UpdateOurServicesResponse } from "./types/response";
import { UpdateOurServicesParams } from "./types/params";

/**
 * Our Services API Service
 * Handles all API calls related to Our Services (website-our-services)
 */
export const CompanyDashboardOurServicesApi = {
  /**
   * Get current Our Services data for the company
   * GET /website-our-services/current
   */
  getCurrent: () =>
    baseApi.get<GetCurrentOurServicesResponse>("website-our-services/current"),

  /**
   * Update current Our Services data for the company
   * POST /website-our-services/current
   * @param body - Our Services update parameters
   */
  updateCurrent: (body: UpdateOurServicesParams) => {
    return baseApi.post<UpdateOurServicesResponse>("website-our-services/current", body);
  },


  /**
   * Get design types list
   * GET /website-our-services/design-types
   */
  getDesignTypes: () =>
    baseApi.get<GetDesignTypesResponse>("/website-our-services/service-types"),
};

