import { apiClient, baseURL } from "@/config/axios-config";


/**
 * Communication Website Contact Info API
 * Handles operations for contact info management
 */
export const CommunicationWebsiteContactInfoApi = {
  /**
   * Get current contact info
   */
  getCurrent: async () => {
    return apiClient.get(baseURL+"/website-contact-info/current");
  },

  /**
   * Update current contact info
   */
  update: async (email: string, phone: string) => {
    return apiClient.put(baseURL+"/website-contact-info/current", {
      email,
      phone,
    });
  },
};

