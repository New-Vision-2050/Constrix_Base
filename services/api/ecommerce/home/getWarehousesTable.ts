import { baseApi } from "@/config/axios/instances/base";

export interface WarehouseItem {
  name: string;
  products_count: number;
}

export interface WarehousesTableResponse {
  code: string;
  message: string;
  payload: WarehouseItem[];
}

export const getWarehousesTable = async (): Promise<WarehousesTableResponse> => {
  const response = await baseApi.get("/ecommerce/dashboard/warehouses-table");
  return response.data;
};
