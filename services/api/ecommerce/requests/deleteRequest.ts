import { apiClient } from "@/config/axios-config";

export interface DeleteRequestResponse {
  code: string;
  message: string | null;
  payload: null;
}

export const deleteRequest = async (
  requestId: string
): Promise<DeleteRequestResponse> => {
  const response = await apiClient.delete(
    `/ecommerce/dashboard/orders/${requestId}`
  );

  return response.data;
};
