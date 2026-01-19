import { NewArrivalsRow } from "@/modules/stores/pages-setting/list/views/new-arrivals/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListPagesSettingResponse
  extends ApiPaginatedResponse<NewArrivalsRow[]> {}

export interface ShowPageSettingResponse
  extends ApiBaseResponse<NewArrivalsRow> {}
