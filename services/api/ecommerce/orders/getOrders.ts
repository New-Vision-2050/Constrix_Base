import { apiClient } from "@/config/axios-config";

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  store: string;
  status: string;
  total_amount: string;
  actions: string;
}

export interface GetOrdersResponse {
  code: string;
  message: string | null;
  payload: {
    data: Order[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const getOrders = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<GetOrdersResponse> => {
  const response = await apiClient.get("/ecommerce/dashboard/orders", {
    params,
  });
  return response.data;
};
