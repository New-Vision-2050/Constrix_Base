import { apiClient } from "@/config/axios-config";

export interface Request {
  id: string;
  order_serial: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  store: string;
  order_status: {
    order_status: string;
    payment_status: string;
  };
  total_price: string;
  actions: string;
}

export interface GetRequestsResponse {
  code: string;
  message: string | null;
  payload: {
    data: Request[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export const getRequests = async (params?: {
  page?: number;
  per_page?: number;
  search?: string;
}): Promise<GetRequestsResponse> => {
  const response = await apiClient.get("/ecommerce/dashboard/orders", {
    params,
  });
  return response.data;
};
