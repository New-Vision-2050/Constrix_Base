import { baseApi } from "@/config/axios/instances/base";
import { GetCurrentTermsConditionsResponse } from "./types/response";
import { UpdateTermsConditionsParams } from "./types/params";

/**
 * Terms and Conditions API Service
 * 
 * Follows SOLID principles:
 * - Single Responsibility: Handles only Terms & Conditions API calls
 * - Open/Closed: Easy to extend with new endpoints
 * - Dependency Inversion: Depends on baseApi abstraction
 * 
 * @example
 * // Get current terms and conditions
 * const response = await CompanyDashboardTermsConditionsApi.getCurrent();
 * 
 * // Update terms and conditions
 * await CompanyDashboardTermsConditionsApi.updateCurrent({ content: "..." });
 */
export const CompanyDashboardTermsConditionsApi = {
  /**
   * Fetches the current terms and conditions
   * @returns Promise with terms and conditions data
   */
  getCurrent: () =>
    baseApi.get<GetCurrentTermsConditionsResponse>(
      "website-term-and-conditions/current"
    ),

  /**
   * Updates the current terms and conditions
   * @param body - The content to update
   * @returns Promise with update response
   */
  updateCurrent: (body: UpdateTermsConditionsParams) =>
    baseApi.put("website-term-and-conditions/current", body),
};

