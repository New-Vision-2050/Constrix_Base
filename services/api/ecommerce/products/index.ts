import { baseApi } from "@/config/axios/instances/base";
import { ListCategoriesResponse, ShowCategoryResponse } from "./types/response";
import { CreateProductParams, UpdateProductParams } from "./types/params";

export const ProductsApi = {
  list: () => baseApi.get<ListCategoriesResponse>("ecommerce/products"),
  show: (id: string) =>
    baseApi.get<ShowCategoryResponse>(`ecommerce/products/${id}`),
  create: (params: CreateProductParams) =>
    baseApi.post("ecommerce/products", params),
  update: (id: string, params: UpdateProductParams) =>
    baseApi.put(`ecommerce/products/${id}`, params),
  delete: (id: string) => baseApi.put(`ecommerce/products/${id}`),
};
