import { apiClient } from "@/config/axios-config";

export interface UpdateRequestStatusPayload {
  order_status: string;
}

export interface UpdateRequestStatusResponse {
  code: string;
  message: string | null;
  payload: {
    id: string;
    order_status: {
      order_status: string;
      payment_status: string;
    };
  };
}

export const updateRequestStatus = async (
  requestId: string,
  payload: UpdateRequestStatusPayload
): Promise<UpdateRequestStatusResponse> => {
  const response = await apiClient.patch(
    `/ecommerce/dashboard/orders/${requestId}/status`,
    payload
  );

  return response.data;
};
