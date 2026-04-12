import { baseApi } from "@/config/axios/instances/base";
import { PendingSharesCountResponse } from "./types/response";

export const SharesApi = {
  getPendingCount: () =>
    baseApi.get<PendingSharesCountResponse>("/resource-shares/pending"),
};
