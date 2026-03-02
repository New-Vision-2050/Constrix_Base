import { baseApi } from "@/config/axios/instances/base";
import { GetTermServiceSettingsResponse } from "./types/response";
import { CreateTermServiceSettingParams } from "./types/params";

export const TermServiceSettingsApi = {
  List: () =>
    baseApi.get<GetTermServiceSettingsResponse>("term-service-settings/all"),
  create: (body: CreateTermServiceSettingParams) =>
    baseApi.post<GetTermServiceSettingsResponse>("term-service-settings", body),
};
