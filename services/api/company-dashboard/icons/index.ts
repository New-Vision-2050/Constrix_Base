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
  update: (id: string, params: UpdateIconParams) => {
    const formData = new FormData();
    formData.append("name_ar", params.name_ar || "");
    formData.append("name_en", params.name_en || "");
    formData.append("category_website_cms_id", params.category_website_cms_id || "");
    if (params.icon) {
      formData.append("icon", params.icon);
    }

    return baseApi.put(`website-icons/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: string) =>
    baseApi.delete(`website-icons/${id}`),
};

