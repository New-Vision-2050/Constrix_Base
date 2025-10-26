import { baseApi } from "@/config/axios/instances/base";

export interface CreateCouponParams {
  coupon_type: string;
  code: string;
  title?: string;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  max_usage_per_user: number;
  max_usage_limit: number;
  max_purchase_amount: number;
  start_date: string;
  expire_date: string;
}

export interface UpdateCouponParams extends Partial<CreateCouponParams> {}

export const CouponsApi = {
  create: (params: CreateCouponParams) =>
    baseApi.post("ecommerce/dashboard/coupons", params),
  
  update: (id: string, params: UpdateCouponParams) =>
    baseApi.put(`ecommerce/dashboard/coupons/${id}`, params),
  
  show: (id: string) =>
    baseApi.get(`ecommerce/dashboard/coupons/${id}`),
  
  delete: (id: string) =>
    baseApi.delete(`ecommerce/dashboard/coupons/${id}`),
};
