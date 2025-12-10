import { baseApi } from "@/config/axios/instances/base";
import { ListServicesResponse, ShowServiceResponse } from "./types/response";
import { CreateServiceParams, UpdateServiceParams } from "./types/params";
import { serialize } from "object-to-formdata";

export const CompanyDashboardServicesApi = {
  list: (params?: { search?: string; page?: number; per_page?: number }) =>
    baseApi.get<ListServicesResponse>("website-services", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowServiceResponse>(`website-services/${id}`),
  create: (params: CreateServiceParams) =>
    baseApi.post(
      "website-services",
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      })
    ),
  update: (id: string, params: UpdateServiceParams) =>
    baseApi.put(
      `website-services/${id}`,
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      })
    ),
  delete: (id: string) => baseApi.delete(`website-services/${id}`),
  status: (id: string, params: { status: number }) =>
    baseApi.put(`website-services/${id}/status`, params),
};
