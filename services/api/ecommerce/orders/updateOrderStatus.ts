import { apiClient } from "@/config/axios-config";

export interface UpdateOrderStatusPayload {
  order_status: string;
}

export interface UpdateOrderStatusResponse {
  code: string;
  message: string | null;
  payload: {
    id: string;
    current_status: string;
  };
}

export const updateOrderStatus = async (
  orderId: string,
  payload: UpdateOrderStatusPayload
): Promise<UpdateOrderStatusResponse> => {
  const response = await apiClient.patch(
    `/ecommerce/dashboard/orders/${orderId}/status`,
    payload
  );

  return response.data;
};
