import { baseApi } from "@/config/axios/instances/base";
import { ListFeaturesResponse, ShowFeatureResponse } from "./types/response";
import { serialize } from "object-to-formdata";
import { CreateFeatureParams, UpdateFeatureParams } from "./types/params";

export const FeaturesApi = {
  list: (params?: {
    search?: string;
    page?: number;
    per_page?: number;
    type?: string;
  }) =>
    baseApi.get<ListFeaturesResponse>("ecommerce/dashboard/features", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowFeatureResponse>(`ecommerce/dashboard/features/${id}`),
  create: (params: CreateFeatureParams) => {
    return baseApi.post(
      "ecommerce/dashboard/features",
      serialize(params, {
        indices: true,
      }),
    );
  },
  update: (id: string, params: UpdateFeatureParams) => {
    return baseApi.post(
      `ecommerce/dashboard/features/${id}`,
      serialize(params, {
        indices: true,
      }),
    );
  },
  delete: (id: string) => baseApi.delete(`ecommerce/dashboard/features/${id}`),
};
