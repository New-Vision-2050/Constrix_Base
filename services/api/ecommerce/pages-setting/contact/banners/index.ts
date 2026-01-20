import { baseApi } from "@/config/axios/instances/base";
import { ListBannersResponse, ShowBannerResponse } from "./types/response";
import { serialize } from "object-to-formdata";
import { CreateBannerParams, UpdateBannerParams } from "./types/params";

export const BannersApi = {
  list: (params?: {
    search?: string;
    page?: number;
    per_page?: number;
    type?: string;
  }) =>
    baseApi.get<ListBannersResponse>("ecommerce/dashboard/banners", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowBannerResponse>(`ecommerce/dashboard/banners/${id}`),
  create: (params: CreateBannerParams) => {
    return baseApi.post(
      "ecommerce/dashboard/banners",
      serialize(params, {
        indices: true,
      }),
    );
  },
  update: (id: string, params: UpdateBannerParams) => {
    return baseApi.post(
      `ecommerce/dashboard/banners/${id}`,
      serialize(params, {
        indices: true,
      }),
    );
  },
  delete: (id: string) => baseApi.delete(`ecommerce/dashboard/banners/${id}`),
};
