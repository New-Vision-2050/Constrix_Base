import { apiClient } from "@/config/axios-config";

export interface StatusOption {
  status: string;
  label: string;
  color: string;
}

export interface GetAvailableStatusesResponse {
  code: string;
  message: string | null;
  payload: {
    current_status: string;
    available_statuses: StatusOption[];
  };
}

export const getAvailableStatuses = async (
  orderId: string
): Promise<GetAvailableStatusesResponse> => {
  const response = await apiClient.get(
    `/ecommerce/dashboard/orders/${orderId}/available-statuses`
  );
  return response.data;
};
