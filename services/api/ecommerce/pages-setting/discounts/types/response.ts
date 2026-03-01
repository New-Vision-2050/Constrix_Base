import { DiscountsRow } from "@/modules/stores/pages-setting/list/views/discounts/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListPagesSettingResponse
  extends ApiPaginatedResponse<DiscountsRow[]> {}

export interface ShowPageSettingResponse
  extends ApiBaseResponse<DiscountsRow> {}
