import { apiClient } from "@/config/axios-config";

export interface RequestDetails {
  id: string;
  order_serial: string;
  order_id: string;
  customer_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  order_date: string;
  store: string;
  order_status: {
    order_status: string;
    payment_status: string;
  };
  payment_method: string;
  country: string;
  shipping_address: string;
  order_note?: string;
  total_price: string;
  items?: Array<{
    id: string;
    product_id: string;
    product_name: string;
    quantity: number;
    price: string;
    total: string;
  }>;
}

export interface GetRequestDetailsResponse {
  code: string;
  message: string | null;
  payload: RequestDetails;
}

export const getRequestDetails = async (
  requestId: string
): Promise<GetRequestDetailsResponse> => {
  const response = await apiClient.get(
    `/ecommerce/dashboard/orders/${requestId}`
  );
  return response.data;
};
