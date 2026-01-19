import { baseApi } from "@/config/axios/instances/base";
import { ListBranchesResponse, ShowBranchResponse } from "./types/response";
import { serialize } from "object-to-formdata";
import { CreateBranchParams, UpdateBranchParams } from "./types/params";

export const BranchesApi = {
  list: (params?: {
    search?: string;
    page?: number;
    per_page?: number;
    type?: string;
  }) =>
    baseApi.get<ListBranchesResponse>("ecommerce/dashboard/store-branches", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowBranchResponse>(`ecommerce/dashboard/store-branches/${id}`),
  create: (params: CreateBranchParams) => {
    return baseApi.post(
      "ecommerce/dashboard/store-branches",
      serialize(params, {
        indices: true,
      })
    );
  },
  update: (id: string, params: UpdateBranchParams) => {
    return baseApi.put(
      `ecommerce/dashboard/store-branches/${id}`,
      serialize(params, {
        indices: true,
      })
    );
  },
  delete: (id: string) =>
    baseApi.delete(`ecommerce/dashboard/store-branches/${id}`),
};
