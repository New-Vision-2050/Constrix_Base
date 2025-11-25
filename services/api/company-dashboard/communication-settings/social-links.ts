import { baseApi } from "@/config/axios/instances/base";
import { ShowSocialLinkResponse, ListSocialLinksResponse } from "./types/response";
import { CreateSocialLinkParams, UpdateSocialLinkParams } from "./types/params";


/**
 * Communication Settings Social Links API
 * Handles CRUD operations for social links management
 */
export const CommunicationSettingsSocialLinksApi = {
  /**
   * Get all social links
   */
  getAll: () =>
    baseApi.get<ListSocialLinksResponse>("social-media-links"),
  /**
   * Fetch single social link by ID
   */
  show: (id: string) =>
    baseApi.get<ShowSocialLinkResponse>(`social-media-links/${id}`),

  /**
   * Create new social link
   */
  create: (body: CreateSocialLinkParams) => {
    return baseApi.post("social-media-links", body);
  },

  /**
   * Update existing social link
   */
  update: (id: string, body: UpdateSocialLinkParams) => {
    return baseApi.put(`social-media-links/${id}`, body);
  },

  /**
   * Delete social link
   */
  delete: (id: string) =>
    baseApi.delete(`social-media-links/${id}`),
};

