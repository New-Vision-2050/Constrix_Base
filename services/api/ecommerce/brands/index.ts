import { baseApi } from "@/config/axios/instances/base";
import { ListBrandsResponse, ShowBrandResponse } from "./types/response";
import { CreateBrandParams, UpdateBrandParams } from "./types/params";
import { serialize } from "object-to-formdata";

export const BrandsApi = {
  list: (params?: { search?: string }) =>
    baseApi.get<ListBrandsResponse>("ecommerce/dashboard/brands", { params }),
  show: (id: string) =>
    baseApi.get<ShowBrandResponse>(`ecommerce/dashboard/brands/${id}`),
  create: (params: CreateBrandParams) => {
    return baseApi.post(
      "ecommerce/dashboard/brands",
      serialize(params, {
        indices: true,
      })
    );
  },
  update: (id: string, params: UpdateBrandParams) => {
    return baseApi.post(
      `ecommerce/dashboard/brands/${id}`,
      serialize(params, {
        indices: true,
      })
    );
  },
  delete: (id: string) => baseApi.delete(`ecommerce/dashboard/brands/${id}`),
};
