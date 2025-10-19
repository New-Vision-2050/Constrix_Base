import { baseApi } from "@/config/axios/instances/base";
import {
  ListProductsResponse,
  ShowProductResponse,
  CreateProductResponse,
  UpdateProductResponse,
} from "./types/response";
import { CreateProductParams, UpdateProductParams } from "./types/params";
import { serialize } from "object-to-formdata";

export const ProductsApi = {
  list: () => baseApi.get<ListProductsResponse>("ecommerce/dashboard/products"),
  show: (id: string) =>
    baseApi.get<ShowProductResponse>(`ecommerce/dashboard/products/${id}`),
  create: (params: CreateProductParams) =>
    baseApi.post<CreateProductResponse>(
      "ecommerce/dashboard/products",
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      })
    ),
  update: (id: string, params: UpdateProductParams) =>
    baseApi.post<UpdateProductResponse>(
      `ecommerce/dashboard/products/${id}`,
      params
    ),
  delete: (id: string) => baseApi.delete(`ecommerce/dashboard/products/${id}`),
};
