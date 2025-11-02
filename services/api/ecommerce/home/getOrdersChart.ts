import { baseApi } from "@/config/axios/instances/base";

export interface OrdersChartPayload {
  active_tab: string;
  labels: string[];
  data: number[];
}

export interface OrdersChartResponse {
  code: string;
  message: string;
  payload: OrdersChartPayload;
}

export type ChartPeriod = "week" | "month" | "year";

export const getOrdersChart = async (
  period: ChartPeriod = "week"
): Promise<OrdersChartResponse> => {
  const response = await baseApi.get(
    `/ecommerce/dashboard/orders-chart?period=${period}`
  );
  return response.data;
};
