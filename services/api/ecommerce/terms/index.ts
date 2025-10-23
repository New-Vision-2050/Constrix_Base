import { baseApi } from "@/config/axios/instances/base";
import { ShowTermsResponse } from "./types/response";
import { UpdateTermsParams } from "./types/params";

export const TermsApi = {
  show: (type: string) =>
    baseApi.get<ShowTermsResponse>(`ecommerce/dashboard/terms/${type}`),
  update: (type: string, params: UpdateTermsParams) =>
    baseApi.put(`ecommerce/dashboard/terms/${type}`, params),
};
