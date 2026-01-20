import { baseApi } from "@/config/axios/instances/base";
import {
  ListPagesSettingResponse,
  ShowPageSettingResponse,
} from "./types/response";
import {
  CreatePageSettingParams,
  UpdatePageSettingParams,
} from "./types/params";
import { serialize } from "object-to-formdata";

export const PagesSettingApi = {
  list: (params?: {
    search?: string;
    page?: number;
    per_page?: number;
    type?: string;
  }) =>
    baseApi.get<ListPagesSettingResponse>("ecommerce/dashboard/banners", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowPageSettingResponse>(`ecommerce/dashboard/banners/${id}`),
  create: (params: CreatePageSettingParams) => {
    return baseApi.post(
      "ecommerce/dashboard/banners",
      serialize(params, {
        indices: true,
      })
    );
  },
  update: (id: string, params: UpdatePageSettingParams) => {
    return baseApi.post(
      `ecommerce/dashboard/banners/${id}`,
      serialize(params, {
        indices: true,
      })
    );
  },
  delete: (id: string) => baseApi.delete(`ecommerce/dashboard/banners/${id}`),
};
