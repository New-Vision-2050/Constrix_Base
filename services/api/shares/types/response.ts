import { ApiBaseResponse } from "@/types/common/response/base";

export interface PendingSharesCountResponse extends ApiBaseResponse<{
  count: number;
  data: unknown;
}> {}
