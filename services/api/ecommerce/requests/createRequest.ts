import { apiClient } from "@/config/axios-config";

export interface CreateRequestPayload {
  customer_id?: string | null;
  is_guest: boolean;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  payment_method: string;
  country: string;
  shipping_address: string;
  order_note?: string;
  order_items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface CreateRequestResponse {
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

export const createRequest = async (
  payload: CreateRequestPayload
): Promise<CreateRequestResponse> => {
  const response = await apiClient.post(
    "/ecommerce/dashboard/orders",
    payload
  );

  return response.data;
};
