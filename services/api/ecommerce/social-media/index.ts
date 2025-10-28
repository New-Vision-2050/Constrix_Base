import { baseApi } from "@/config/axios/instances/base";
import {
  ListSocialMediaResponse,
  ShowSocialMediaResponse,
  CreateSocialMediaResponse,
  UpdateSocialMediaResponse,
  DeleteSocialMediaResponse,
} from "./types/response";
import {
  CreateSocialMediaParams,
  UpdateSocialMediaParams,
  ListSocialMediaParams,
} from "./types/params";

export const SocialMediaApi = {
  list: (params?: ListSocialMediaParams) =>
    baseApi.get<ListSocialMediaResponse>("/social_icons", {
      params,
    }),

  show: (id: string) =>
    baseApi.get<ShowSocialMediaResponse>(
      `ecommerce/dashboard/social_media/${id}`
    ),

  create: (params: CreateSocialMediaParams) =>
    baseApi.post<CreateSocialMediaResponse>(
      "ecommerce/dashboard/social_media",
      params
    ),

  update: (id: string, params: UpdateSocialMediaParams) =>
    baseApi.put<UpdateSocialMediaResponse>(
      `ecommerce/dashboard/social_media/${id}`,
      params
    ),

  delete: (id: string) =>
    baseApi.delete<DeleteSocialMediaResponse>(
      `ecommerce/dashboard/social_media/${id}`
    ),
};
