import { baseApi } from "@/config/axios/instances/base";
import { serialize } from "object-to-formdata";

export interface CreateDealOfDayParams {
  name: {
    ar: string;
    en: string;
  };
  product_id: string;
  discount_type: "percentage" | "amount";
  discount_value: number;
}

export interface UpdateDealOfDayParams extends Partial<CreateDealOfDayParams> {}

export const DealDaysApi = {
  list: (params?: { search?: string; page?: number; per_page?: number }) =>
    baseApi.get("ecommerce/dashboard/deal_days", { params }),

  create: (params: CreateDealOfDayParams) =>
    baseApi.post(
      "/ecommerce/dashboard/deal_days",
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      }),
    ),

  update: (id: string, params: UpdateDealOfDayParams) =>
    baseApi.put(`/ecommerce/dashboard/deal_days/${id}`, params),

  show: (id: string) => baseApi.get(`/ecommerce/dashboard/deal_days/${id}`),

  delete: (id: string) =>
    baseApi.delete(`/ecommerce/dashboard/deal_days/${id}`),
};
