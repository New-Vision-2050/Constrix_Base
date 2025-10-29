export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_phone: string;
  order_date: string;
  store: string;
  status: string;
  current_status?: string;
  total_amount: string;
  actions: string;
}

export interface StatusOption {
  status: string;
  label: string;
  color: string;
}

export interface OrderDetails extends Order {
  items?: OrderItem[];
  shipping_address?: string;
  payment_method?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: string;
  total: string;
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

export interface GetOrderDetailsResponse {
  code: string;
  message: string | null;
  payload: OrderDetails;
}

export interface GetAvailableStatusesResponse {
  code: string;
  message: string | null;
  payload: {
    current_status: string;
    available_statuses: StatusOption[];
  };
}

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
