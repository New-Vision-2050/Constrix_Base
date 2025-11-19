import { baseApi } from "@/config/axios/instances/base";
import { ListIconsResponse, ShowIconResponse } from "./types/response";
import { CreateIconParams, UpdateIconParams } from "./types/params";
import { serialize } from "object-to-formdata";

export const CompanyDashboardIconsApi = {
  list: (params?: { search?: string }) =>
    baseApi.get<ListIconsResponse>("website-icons", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowIconResponse>(`website-icons/${id}`),
  create: (body: CreateIconParams) => {

    return baseApi.post("website-icons", serialize(body));
  },
  update: (id: string, body: UpdateIconParams) => {
    return baseApi.post(`website-icons/${id}`, serialize(body), {
      params:{
        _method: "PUT",
      }
    });
  },
  delete: (id: string) =>
    baseApi.delete(`website-icons/${id}`),
};

