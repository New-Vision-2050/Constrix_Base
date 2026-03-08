import { baseApi } from "@/config/axios/instances/base";
import {
  ShowSocialLinkResponse,
  ListSocialLinksResponse,
} from "./types/response";
import { CreateSocialLinkParams, UpdateSocialLinkParams } from "./types/params";
import { serialize } from "object-to-formdata";
import { exportRequest } from "@/utils/exportRequest";

/**
 * Communication Settings Social Links API
 * Handles CRUD operations for social links management
 */
export const CommunicationSettingsSocialLinksApi = {
  /**
   * Get all social links
   */
  getAll: (params?: {
    page?: number;
    per_page?: number;
    type?: string;
    sort_by?: string;
    sort_direction?: "asc" | "desc";
    status?: number;
    link?: string;
  }) => baseApi.get<ListSocialLinksResponse>("social-media-links", { params }),
  /**
   * Fetch single social link by ID
   */
  show: (id: string) =>
    baseApi.get<ShowSocialLinkResponse>(`social-media-links/${id}`),

  /**
   * Create new social link
   */
  create: (body: CreateSocialLinkParams) => {
    return baseApi.post("social-media-links", serialize(body));
  },

  /**
   * Update existing social link
   */
  update: (id: string, body: UpdateSocialLinkParams) => {
    return baseApi.post(`social-media-links/${id}`, serialize(body), {
      params: {
        _method: "PUT",
      },
    });
  },

  /**
   * Delete social link
   */
  delete: (id: string) => baseApi.delete(`social-media-links/${id}`),

  /**
   * Export social links
   */
  export: exportRequest("social-media-links/export"),
};
