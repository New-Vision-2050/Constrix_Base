import { baseApi } from "@/config/axios/instances/base";
import { ListCategoriesResponse, ShowCategoryResponse } from "./types/response";
import { CreateCategoryParams, UpdateCategoryParams } from "./types/params";

export const CategoriesApi = {
  list: (params?: { parent_id?: string }) =>
    baseApi.get<ListCategoriesResponse>("ecommerce/dashboard/categories", {
      params,
    }),
  show: (id: string) =>
    baseApi.get<ShowCategoryResponse>(`ecommerce/dashboard/categories/${id}`),
  create: (params: CreateCategoryParams) => {
    const formData = new FormData();
    formData.append("name[ar]", params["name[ar]"]);
    formData.append("name[en]", params["name[en]"]);
    if (params.priority)
      formData.append("priority", params.priority.toString());
    if (params.parent_id) formData.append("parent_id", params.parent_id);
    if (params.description) formData.append("description", params.description);
    if (params.image) formData.append("image", params.image);

    return baseApi.post("ecommerce/dashboard/categories", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  update: (id: string, params: UpdateCategoryParams) => {
    const formData = new FormData();
    if (params["name[ar]"]) formData.append("name[ar]", params["name[ar]"]);
    if (params["name[en]"]) formData.append("name[en]", params["name[en]"]);
    if (params.priority)
      formData.append("priority", params.priority.toString());
    if (params.parent_id) formData.append("parent_id", params.parent_id);
    if (params.description) formData.append("description", params.description);
    if (params.image) formData.append("image", params.image);

    return baseApi.post(`ecommerce/dashboard/categories/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  delete: (id: string) => baseApi.put(`ecommerce/dashboard/categories/${id}`),
};
