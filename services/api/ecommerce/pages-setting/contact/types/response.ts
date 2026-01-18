import { ContactRow } from "@/modules/stores/pages-setting/list/views/contact/types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListPagesSettingResponse
  extends ApiPaginatedResponse<ContactRow[]> {}

export interface ShowPageSettingResponse extends ApiBaseResponse<ContactRow> {}
