import { baseApi } from "@/config/axios/instances/base";
import { ListCategoriesResponse, ShowCategoryResponse } from "./types/response";
import { CreateCategoryParams, UpdateCategoryParams } from "./types/params";

export const CompanyDashboardCategoriesApi = {
  list: (params?: { search?: string }) =>
    baseApi.get<ListCategoriesResponse>("categories-website", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowCategoryResponse>(
      `categories-website/${id}`
    ),
  create: (params: CreateCategoryParams) => {
    const formData = new FormData();
    formData.append("name_ar", params.name_ar);
    formData.append("name_en", params.name_en);
    formData.append("category_type", params.category_type);

    return baseApi.post("categories-website", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id: string, params: UpdateCategoryParams) => {
    const formData = new FormData();
    if (params.name_ar) formData.append("name_ar", params.name_ar);
    if (params.name_en) formData.append("name_en", params.name_en);
    if (params.category_type) formData.append("category_type", params.category_type);

    console.log('params', params)

    return baseApi.post(`categories-website/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: string) =>
    baseApi.delete(`categories-website/${id}`),
  categoriesTypes: () =>
    baseApi.get(`categories-website/categeory-types`),
};
