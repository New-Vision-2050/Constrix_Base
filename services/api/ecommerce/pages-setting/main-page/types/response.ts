import { MainPageRow } from "@/modules/stores/pages-setting/list/views/main-page/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListPagesSettingResponse
  extends ApiPaginatedResponse<MainPageRow[]> {}

export interface ShowPageSettingResponse extends ApiBaseResponse<MainPageRow> {}
