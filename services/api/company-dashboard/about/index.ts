import { baseApi } from "@/config/axios/instances/base";
import { GetCurrentAboutUsResponse, UpdateAboutUsResponse } from "./types/response";
import { UpdateAboutUsParams } from "./types/params";
import { serialize } from "object-to-formdata";

/**
 * About Us API Service
 * Handles all API calls related to About Us (website-about-us)
 */
export const CompanyDashboardAboutApi = {
  /**
   * Get current About Us data for the company
   * GET /website-about-us/current
   */
  getCurrent: () =>
    baseApi.get<GetCurrentAboutUsResponse>("website-about-us/current"),

  /**
   * Update current About Us data for the company
   * POST /website-about-us/current
   * @param body - About Us update parameters
   */
  updateCurrent: (body: UpdateAboutUsParams) => {
    return baseApi.post<UpdateAboutUsResponse>("website-about-us/current", serialize(body));
  },
};

