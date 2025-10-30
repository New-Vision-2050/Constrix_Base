import { apiClient } from "@/config/axios-config";

export interface OrderStatus {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface GetAvailableStatusesResponse {
  code: string;
  message: string | null;
  payload: OrderStatus[];
}

export const getAvailableStatuses = async (): Promise<GetAvailableStatusesResponse> => {
  const response = await apiClient.get(
    "/ecommerce/dashboard/orders/available-statuses"
  );
  return response.data;
};
