import { baseApi } from "@/config/axios/instances/base";
import { ListBrandsResponse, ShowBrandResponse } from "./types/response";
import { CreateBrandParams, UpdateBrandParams } from "./types/params";

export const BrandsApi = {
  list: () => baseApi.get<ListBrandsResponse>("ecommerce/brands"),
  show: (id: string) =>
    baseApi.get<ShowBrandResponse>(`ecommerce/brands/${id}`),
  create: (params: CreateBrandParams) =>
    baseApi.post("ecommerce/brands", params),
  update: (id: string, params: UpdateBrandParams) =>
    baseApi.put(`ecommerce/brands/${id}`, params),
  delete: (id: string) => baseApi.delete(`ecommerce/brands/${id}`),
};
