import { baseApi } from "@/config/axios/instances/base";
import { ShowAddressResponse, GetAllAddressesResponse } from "./types/response";
import { CreateAddressParams, UpdateAddressParams } from "./types/params";

/**
 * Communication Settings Addresses API
 * Handles CRUD operations for address management
 */
export const CommunicationSettingsAddressesApi = {
  /**
   * Get all addresses
   */
  getAll: (params?: {
    page?: number;
    per_page?: number;
    title?: string;
    city_id?: string;
    status?: number;
  }) => baseApi.get<GetAllAddressesResponse>("website-addresses", { params }),
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
  delete: (id: string) => baseApi.delete(`website-addresses/${id}`),
};
