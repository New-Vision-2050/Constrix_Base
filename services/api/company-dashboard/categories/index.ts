import { baseApi } from "@/config/axios/instances/base";
import { ListCategoriesResponse, ShowCategoryResponse } from "./types/response";
import { CreateCategoryParams, UpdateCategoryParams } from "./types/params";

export const CompanyDashboardCategoriesApi = {
  list: (params?: { search?: string, category_type?: string }) =>
    baseApi.get<ListCategoriesResponse>("categories-website", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowCategoryResponse>(
      `categories-website/${id}`
    ),
  create: (body: CreateCategoryParams) => {
    return baseApi.post("categories-website", body);
  },
  update: (id: string, body: UpdateCategoryParams) => {
    return baseApi.put(`categories-website/${id}`, body);
  },
  delete: (id: string) =>
    baseApi.delete(`categories-website/${id}`),
  categoriesTypes: (params?:{[key: string]: string}) =>
    baseApi.get(`categories-website/categeory-types`, {
      params,
    }),
};
