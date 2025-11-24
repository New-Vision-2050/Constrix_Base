import { apiClient } from "@/config/axios-config";
import { AddressFormValues } from "@/modules/content-management-system/communication-settings/schema/address.schema";

/**
 * Communication Settings Addresses API
 * Handles CRUD operations for address management
 */
export const CommunicationSettingsAddressesApi = {
  /**
   * Fetch single address by ID
   */
  show: async (id: string) => {
    return apiClient.get(`/communication-settings/addresses/${id}`);
  },

  /**
   * Create new address
   */
  create: async (data: AddressFormValues) => {
    return apiClient.post("/communication-settings/addresses", {
      address: data.address,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    });
  },

  /**
   * Update existing address
   */
  update: async (id: string, data: AddressFormValues) => {
    return apiClient.put(`/communication-settings/addresses/${id}`, {
      address: data.address,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
    });
  },
};

