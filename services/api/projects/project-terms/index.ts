import { baseApi } from "@/config/axios/instances/base";
import {
  CreateTermSettingArgs,
  UpdateTermSettingArgs,
  DeleteTermSettingArgs,
  GetTermServicesArgs,
  GetTermSettingsArgs,
} from "./types/args";
import {
  CreateTermSettingResponse,
  UpdateTermSettingResponse,
  DeleteTermSettingResponse,
  GetTermServicesResponse,
  GetTermSettingsResponse,
} from "./types/response";

export const ProjectTermsApi = {
  createTermSetting: (args: CreateTermSettingArgs) =>
    baseApi.post<CreateTermSettingResponse>("term-settings", args),
  updateTermSetting: (id: number, args: UpdateTermSettingArgs) =>
    baseApi.put<UpdateTermSettingResponse>(`term-settings/${id}`, args),
  deleteTermSetting: (id: number) =>
    baseApi.delete<DeleteTermSettingResponse>(`term-settings/${id}`),
  getTermSettings: (args?: GetTermSettingsArgs) =>
    baseApi.get<GetTermSettingsResponse>("term-settings", { params: args }),
  getTermSetting: (id: number) =>
    baseApi.get<CreateTermSettingResponse>(`term-settings/${id}`),
  getTermServices: (args?: GetTermServicesArgs) =>
    baseApi.get<GetTermServicesResponse>("term-services", { params: args }),
  getTermChildren: (id: number) =>
    baseApi.get<GetTermSettingsResponse>(`term-settings/${id}/children`),
  getTermServicesByTermId: (termId: number) =>
    baseApi.get<GetTermServicesResponse>(`term-settings/${termId}/services`),
};
