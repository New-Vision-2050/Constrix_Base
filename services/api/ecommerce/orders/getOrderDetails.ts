import { apiClient } from "@/config/axios-config";

export interface OrderDetails {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  store: string;
  current_status: string;
  total_amount: string;
  items?: any[];
}

export interface GetOrderDetailsResponse {
  code: string;
  message: string | null;
  payload: OrderDetails;
}

export const getOrderDetails = async (orderId: string): Promise<GetOrderDetailsResponse> => {
  const response = await apiClient.get(`/ecommerce/dashboard/orders/${orderId}`);
  return response.data;
};
