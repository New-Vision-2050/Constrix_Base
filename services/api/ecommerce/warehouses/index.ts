import { baseApi } from "@/config/axios/instances/base";
import {
  ListWarehousesResponse,
  ShowWarehouseResponse,
} from "./types/response";
import { CreateWarehouseParams, UpdateWarehouseParams } from "./types/params";
import { exportRequest } from "@/utils/exportRequest";

export const WarehousesApi = {
  list: () => baseApi.get<ListWarehousesResponse>("ecommerce/warehouses"),
  show: (id: string) =>
    baseApi.get<ShowWarehouseResponse>(`ecommerce/warehouses/${id}`),
  create: (params: CreateWarehouseParams) =>
    baseApi.post("ecommerce/warehouses", params),
  update: (id: string, params: UpdateWarehouseParams) =>
    baseApi.put(`ecommerce/warehouses/${id}`, params),
  delete: (id: string) => baseApi.delete(`ecommerce/warehouses/${id}`),
  export: exportRequest("job_titles/export"),
};
