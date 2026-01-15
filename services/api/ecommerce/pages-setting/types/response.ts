import { AboutUsRow } from "@/modules/stores/pages-setting/list/views/about-us/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListPagesSettingResponse
  extends ApiPaginatedResponse<AboutUsRow[]> {}

export interface ShowPageSettingResponse extends ApiBaseResponse<AboutUsRow> {}
