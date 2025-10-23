import { baseApi } from "@/config/axios/instances/base";
import { ListBannersResponse, ShowBannerResponse } from "./types/response";
import { CreateBannerParams, UpdateBannerParams } from "./types/params";

export const BannersApi = {
  list: () => baseApi.get<ListBannersResponse>("ecommerce/dashboard/banners"),
  show: (id: string) =>
    baseApi.get<ShowBannerResponse>(`ecommerce/dashboard/banners/${id}`),
  create: (params: CreateBannerParams) => {
    const formData = new FormData();
    const nameAr = params["name[ar]"];
    const nameEn = params["name[en]"];

    if (nameAr) formData.append("name[ar]", nameAr);
    if (nameEn) formData.append("name[en]", nameEn);
    if (params.type) formData.append("type", params.type);
    if (params.banner_image) formData.append("banner_image", params.banner_image);

    return baseApi.post("ecommerce/dashboard/banners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id: string, params: UpdateBannerParams) => {
    const formData = new FormData();
    const nameAr = params["name[ar]"];
    const nameEn = params["name[en]"];

    if (nameAr) formData.append("name[ar]", nameAr);
    if (nameEn) formData.append("name[en]", nameEn);
    if (params.type) formData.append("type", params.type);
    if (params.banner_image) formData.append("banner_image", params.banner_image);

    return baseApi.put(`ecommerce/dashboard/banners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: string) => baseApi.delete(`ecommerce/dashboard/banners/${id}`),
};
