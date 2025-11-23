import { baseApi } from "@/config/axios/instances/base";
import { ListNewsResponse, ShowNewsResponse } from "./types/response";
import { CreateNewsParams, UpdateNewsParams } from "./types/params";
import { serialize } from "object-to-formdata";

export const CompanyDashboardNewsApi = {
  list: (params?: { search?: string; page?: number; per_page?: number }) =>
    baseApi.get<ListNewsResponse>("website-news", {
      params,
    }),
  show: (id: string) => baseApi.get<ShowNewsResponse>(`website-news/${id}`),
  create: (params: CreateNewsParams) =>
    baseApi.post(
      "website-news",
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      })
    ),
  update: (id: string, params: UpdateNewsParams) =>
    baseApi.put(
      `website-news/${id}`,
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      })
    ),
  delete: (id: string) => baseApi.delete(`website-news/${id}`),
  toggleActive: (id: string) =>
    baseApi.patch(`website-news/${id}/toggle-active`),
};
