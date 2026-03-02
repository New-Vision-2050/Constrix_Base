import { baseApi } from "@/config/axios/instances/base";
import {
  GetTermServiceSettingsResponse,
  TermSettingsTreeResponse,
} from "./types/response";
import { CreateTermServiceSettingParams } from "./types/params";

export const TermServiceSettingsApi = {
  List: () =>
    baseApi.get<GetTermServiceSettingsResponse>("term-service-settings/all"),
  getTree: () =>
    baseApi.get<TermSettingsTreeResponse>("term-settings/tree"),
  create: (body: CreateTermServiceSettingParams) =>
    baseApi.post<GetTermServiceSettingsResponse>("term-service-settings", body),
};
