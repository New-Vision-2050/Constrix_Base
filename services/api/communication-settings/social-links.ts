import { apiClient } from "@/config/axios-config";
import { SocialLinkFormData } from "@/modules/content-management-system/communication-settings/schema/social-link.schema";

/**
 * Helper function to convert form data to FormData object
 */
const toFormData = (data: SocialLinkFormData): FormData => {
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
  show: async (id: string) => {
    return apiClient.get(`/communication-settings/social-links/${id}`);
  },

  /**
   * Create new social link
   */
  create: async (data: SocialLinkFormData) => {
    const formData = toFormData(data);
    return apiClient.post("/communication-settings/social-links", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Update existing social link
   */
  update: async (id: string, data: SocialLinkFormData) => {
    const formData = toFormData(data);
    return apiClient.put(`/communication-settings/social-links/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Delete social link
   */
  delete: async (id: string) => {
    return apiClient.delete(`/communication-settings/social-links/${id}`);
  },
};

