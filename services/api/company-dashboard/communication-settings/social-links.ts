import { baseApi } from "@/config/axios/instances/base";
import { ShowSocialLinkResponse } from "./types/response";
import { CreateSocialLinkParams, UpdateSocialLinkParams } from "./types/params";

/**
 * Helper function to convert form data to FormData object
 */
const toFormData = (data: CreateSocialLinkParams | UpdateSocialLinkParams): FormData => {
  const formData = new FormData();
  formData.append("type", data.type);
  formData.append("url", data.url);
  formData.append("social_icon", data.social_icon);
  return formData;
};

/**
 * Communication Settings Social Links API
 * Handles CRUD operations for social links management
 */
export const CommunicationSettingsSocialLinksApi = {
  /**
   * Fetch single social link by ID
   */
  show: (id: string) =>
    baseApi.get<ShowSocialLinkResponse>(`website-social-links/${id}`),

  /**
   * Create new social link
   */
  create: (body: CreateSocialLinkParams) => {
    const formData = toFormData(body);
    return baseApi.post("website-social-links", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Update existing social link
   */
  update: (id: string, body: UpdateSocialLinkParams) => {
    const formData = toFormData(body);
    return baseApi.put(`website-social-links/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Delete social link
   */
  delete: (id: string) =>
    baseApi.delete(`website-social-links/${id}`),
};

