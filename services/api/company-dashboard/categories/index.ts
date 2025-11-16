import { baseApi } from "@/config/axios/instances/base";
import { ListCategoriesResponse, ShowCategoryResponse } from "./types/response";
import { CreateCategoryParams, UpdateCategoryParams } from "./types/params";

export const CompanyDashboardCategoriesApi = {
  list: (params?: { search?: string }) =>
    baseApi.get<ListCategoriesResponse>("company-dashboard/categories/list", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowCategoryResponse>(
      `company-dashboard/categories/${id}`
    ),
  create: (params: CreateCategoryParams) => {
    const formData = new FormData();
    formData.append("name[ar]", params["name[ar]"]);
    formData.append("name[en]", params["name[en]"]);
    formData.append("type", params.type);

    return baseApi.post("company-dashboard/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id: string, params: UpdateCategoryParams) => {
    const formData = new FormData();
    if (params["name[ar]"]) formData.append("name[ar]", params["name[ar]"]);
    if (params["name[en]"]) formData.append("name[en]", params["name[en]"]);
    if (params.type) formData.append("type", params.type);

    return baseApi.post(`company-dashboard/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: string) =>
    baseApi.delete(`company-dashboard/categories/${id}`),
};
