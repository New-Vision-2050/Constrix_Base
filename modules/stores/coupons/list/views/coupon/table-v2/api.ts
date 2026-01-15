/**
 * Coupon API Service
 * Handles all coupon-related API calls
 */

import { apiClient, baseURL } from "@/config/axios-config";
import { CouponsResponse } from "./types";

const COUPONS_ENDPOINT = `${baseURL}/ecommerce/dashboard/coupons`;

/**
 * Fetch paginated coupons with filters
 */
export const CouponsApi = {
  list: async (
    page: number,
    limit: number,
    search?: string
  ): Promise<CouponsResponse> => {
    const params: Record<string, any> = {
      page,
      per_page: limit,
    };

    if (search) {
      params.search = search;
    }

    const response = await apiClient.get(COUPONS_ENDPOINT, { params });
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${COUPONS_ENDPOINT}/${id}`);
  },
};
