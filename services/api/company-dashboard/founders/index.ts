import { baseApi } from "@/config/axios/instances/base";
import { ListFoundersResponse, ShowFounderResponse } from "./types/response";
import { CreateFounderParams, UpdateFounderParams } from "./types/params";
import { serialize } from "object-to-formdata";

export const CompanyDashboardFoundersApi = {
  list: (params?: { search?: string; page?: number; per_page?: number }) =>
    baseApi.get<ListFoundersResponse>("founders", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowFounderResponse>(`founders/${id}`),
  create: (params: CreateFounderParams) =>
    baseApi.post(
      "founders",
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      })
    ),
  update: (id: string, params: UpdateFounderParams) =>
    baseApi.put(
      `founders/${id}`,
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      })
    ),
  delete: (id: string) => baseApi.delete(`founders/${id}`),
};

