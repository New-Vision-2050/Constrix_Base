import { baseApi } from "@/config/axios/instances/base";
import {
  GetCurrentHomepageSettingsResponse,
  UpdateHomepageSettingsResponse,
} from "./types/response";
import { UpdateHomepageSettingsParams } from "./types/params";
import { serialize } from "object-to-formdata";

export const CompanyDashboardHomepageSettingsApi = {
  getCurrent: () =>
    baseApi.get<GetCurrentHomepageSettingsResponse>(
      "website-home-page-settings/current"
    ),

  updateCurrent: (body: UpdateHomepageSettingsParams) => {
    return baseApi.post<UpdateHomepageSettingsResponse>(
      "website-home-page-settings/current",
      serialize(body, {
        indices: true,
      })
    );
  },
};
