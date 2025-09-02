import { baseApi } from "@/config/axios/instances/base";
import { ListCategoriesResponse, ShowCategoryResponse } from "./types/response";
import { CreateCategoryParams, UpdateCategoryParams } from "./types/params";

export const CategoriesApi = {
  list: () => baseApi.get<ListCategoriesResponse>("ecommerce/categories"),
  show: (id: string) =>
    baseApi.get<ShowCategoryResponse>(`ecommerce/categories/${id}`),
  create: (params: CreateCategoryParams) =>
    baseApi.post("ecommerce/categories", params),
  update: (id: string, params: UpdateCategoryParams) =>
    baseApi.put(`ecommerce/categories/${id}`, params),
  delete: (id: string) => baseApi.put(`ecommerce/categories/${id}`),
};
