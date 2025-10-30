import { apiClient } from "@/config/axios-config";

export interface UpdateRequestPayload {
  customer_id?: string;
  is_guest?: boolean;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  payment_method?: string;
  country?: string;
  shipping_address?: string;
  order_note?: string;
  product_id?: string;
  quantity?: number;
}

export interface UpdateRequestResponse {
  code: string;
  message: string | null;
  payload: {
    id: string;
    order_serial: string;
    customer_name: string;
    customer_phone: string;
    customer_email: string;
    order_date: string;
    order_status: {
      order_status: string;
      payment_status: string;
    };
    total_price: string;
  };
}

export const updateRequest = async (
  requestId: string,
  payload: UpdateRequestPayload
): Promise<UpdateRequestResponse> => {
  const response = await apiClient.put(
    `/ecommerce/dashboard/orders/${requestId}`,
    payload
  );

  return response.data;
};
