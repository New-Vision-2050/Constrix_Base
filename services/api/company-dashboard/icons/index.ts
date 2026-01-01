import { baseApi } from "@/config/axios/instances/base";
import { ListIconsResponse, ShowIconResponse } from "./types/response";
import { CreateIconParams, UpdateIconParams } from "./types/params";
import { serialize } from "object-to-formdata";

type ListIconsParams = {
  page: number;
  search?: string;
  categoryType?: string;
}
export const CompanyDashboardIconsApi = {
  list: (params?: ListIconsParams) =>
    baseApi.get<ListIconsResponse>("website-icons", {
      params: {
        page: params?.page ?? 1,
        name: Boolean(params?.search) ? params?.search : undefined,
        website_icon_category_type: Boolean(params?.categoryType) ? params?.categoryType : undefined
      },
    }),
  show: (id: string) =>
    baseApi.get<ShowIconResponse>(`website-icons/${id}`),
  create: (body: CreateIconParams) => {

    return baseApi.post("website-icons", serialize(body));
  },
  update: (id: string, body: UpdateIconParams) => {
    return baseApi.post(`website-icons/${id}`, serialize(body), {
      params: {
        _method: "PUT",
      }
    });
  },
  delete: (id: string) =>
    baseApi.delete(`website-icons/${id}`),
};

