import { baseApi } from "@/config/axios/instances/base";
import { ListBrandsResponse, ShowBrandResponse } from "./types/response";
import { CreateBrandParams, UpdateBrandParams } from "./types/params";

export const BrandsApi = {
  list: () => baseApi.get<ListBrandsResponse>("ecommerce/dashboard/brands"),
  show: (id: string) =>
    baseApi.get<ShowBrandResponse>(`ecommerce/dashboard/brands/${id}`),
  create: (params: CreateBrandParams) => {
    const formData = new FormData();
    const nameAr = params["name[ar]"];
    const nameEn = params["name[en]"];
    const descAr = params["description[ar]"];
    const descEn = params["description[en]"];

    if (nameAr) formData.append("name[ar]", nameAr);
    if (nameEn) formData.append("name[en]", nameEn);
    if (descAr) formData.append("description[ar]", descAr);
    if (descEn) formData.append("description[en]", descEn);
    if (params.brand_image) formData.append("brand_image", params.brand_image);

    return baseApi.post("ecommerce/dashboard/brands", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id: string, params: UpdateBrandParams) => {
    const formData = new FormData();
    const nameAr = params["name[ar]"];
    const nameEn = params["name[en]"];
    const descAr = params["description[ar]"];
    const descEn = params["description[en]"];

    if (nameAr) formData.append("name[ar]", nameAr);
    if (nameEn) formData.append("name[en]", nameEn);
    if (descAr) formData.append("description[ar]", descAr);
    if (descEn) formData.append("description[en]", descEn);
    if (params.brand_image) formData.append("brand_image", params.brand_image);

    return baseApi.post(`ecommerce/dashboard/brands/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: string) => baseApi.delete(`ecommerce/dashboard/brands/${id}`),
};
