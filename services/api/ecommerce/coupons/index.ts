import { baseApi } from "@/config/axios/instances/base";

export interface CreateCouponParams {
  coupon_type: string;
  code: string;
  title: string;
  customer_id?: string | null;
  max_usage_per_user?: number | null;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  min_purchase: number;
  max_discount: number;
  start_date: string;
  expire_date: string;
}

export interface UpdateCouponParams extends Partial<CreateCouponParams> {}

export const CouponsApi = {
  create: (params: CreateCouponParams) =>
    baseApi.post("ecommerce/dashboard/coupons", params),

  update: (id: string, params: UpdateCouponParams) =>
    baseApi.put(`ecommerce/dashboard/coupons/${id}`, params),

  show: (id: string) => baseApi.get(`ecommerce/dashboard/coupons/${id}`),

  delete: (id: string) => baseApi.delete(`ecommerce/dashboard/coupons/${id}`),
};
