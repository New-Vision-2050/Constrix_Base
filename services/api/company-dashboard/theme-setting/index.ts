import { baseApi } from "@/config/axios/instances/base";
import { GetCurrentThemeSettingResponse, UpdateThemeSettingResponse } from "./types/response";
import { UpdateThemeSettingParams } from "./types/params";
import { serialize } from "object-to-formdata";

/**
 * Theme Setting API Service
 * Handles all API calls related to Theme Settings (website-themes)
 */
export const CompanyDashboardThemeSettingApi = {
  /**
   * Get current Theme Settings for the company
   * GET /website-themes/current-company
   */
  getCurrent: () =>
    baseApi.get<GetCurrentThemeSettingResponse>("website-themes/current-company-with-attributes"),

  /**
   * Update current Theme Settings for the company
   * POST /website-themes/current-company
   * @param body - Theme Settings update parameters
   */
  updateCurrent: (body: UpdateThemeSettingParams) => {
    return baseApi.post<UpdateThemeSettingResponse>("website-themes/current-company", serialize(body,{
      indices: true,
    }));
  },
};

