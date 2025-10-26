import { baseApi } from "@/config/axios/instances/base";
import { serialize } from "object-to-formdata";

export interface CreateFlashDealParams {
  name: {
    ar: string;
    en: string;
  };
  start_date: string;
  end_date: string;
  image?: File | null;
}

export interface UpdateFlashDealParams extends Partial<CreateFlashDealParams> {}

export const FlashDealsApi = {
  create: (params: CreateFlashDealParams) =>
    baseApi.post(
      "ecommerce/dashboard/flash_deals",
      serialize(params, {
        indices: true,
        booleansAsIntegers: true,
      })
    ),

  update: (id: string, params: UpdateFlashDealParams) =>
    baseApi.put(`ecommerce/dashboard/flash_deals/${id}`, params),

  show: (id: string) => baseApi.get(`ecommerce/dashboard/flash_deals/${id}`),

  delete: (id: string) =>
    baseApi.delete(`ecommerce/dashboard/flash_deals/${id}`),
};
