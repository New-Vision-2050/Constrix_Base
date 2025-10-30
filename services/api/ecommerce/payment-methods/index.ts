import { baseApi } from "@/config/axios/instances/base";
import { ApiBaseResponse } from "@/types/common/response/base";

export interface PaymentMethod {
  id: string;
  name: string;
  name_ar?: string;
  name_en?: string;
  is_active: boolean;
}

export interface ListPaymentMethodsResponse
  extends ApiBaseResponse<PaymentMethod[]> {}

export const PaymentMethodsApi = {
  list: () =>
    baseApi.get<ListPaymentMethodsResponse>(
      "ecommerce/dashboard/payment_methods"
    ),
};
