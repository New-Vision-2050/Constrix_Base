import { baseApi } from "@/config/axios/instances/base";
import { ShowAddressResponse } from "./types/response";
import { CreateAddressParams, UpdateAddressParams } from "./types/params";

/**
 * Communication Settings Addresses API
 * Handles CRUD operations for address management
 */
export const CommunicationSettingsAddressesApi = {
  /**
   * Fetch single address by ID
   */
  show: (id: string) =>
    baseApi.get<ShowAddressResponse>(`website-addresses/${id}`),

  /**
   * Create new address
   */
  create: (body: CreateAddressParams) =>
    baseApi.post("website-addresses", body),

  /**
   * Update existing address
   */
  update: (id: string, body: UpdateAddressParams) =>
    baseApi.put(`website-addresses/${id}`, body),

  /**
   * Delete address
   */
  delete: (id: string) =>
    baseApi.delete(`website-addresses/${id}`),
};

