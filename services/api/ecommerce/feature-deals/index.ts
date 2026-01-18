import { baseApi } from "@/config/axios/instances/base";
import { serialize } from "object-to-formdata";

export interface CreateFeatureDealParams {
  product_id: string;
  discount_type: "percentage" | "amount";
  discount_value: number;
  start_date: string;
  end_date: string;
}

export interface UpdateFeatureDealParams extends Partial<CreateFeatureDealParams> {}

export const FeatureDealsApi = {
  list: (params?: { search?: string; page?: number; per_page?: number }) =>
    baseApi.get("ecommerce/dashboard/feature_deals", { params }),

  create: (params: CreateFeatureDealParams) =>
    baseApi.post(
      "ecommerce/dashboard/feature_deals",
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      }),
    ),

  update: (id: string, params: UpdateFeatureDealParams) =>
    baseApi.put(`ecommerce/dashboard/feature_deals/${id}`, params),

  show: (id: string) => baseApi.get(`ecommerce/dashboard/feature_deals/${id}`),

  delete: (id: string) =>
    baseApi.delete(`ecommerce/dashboard/feature_deals/${id}`),
};
