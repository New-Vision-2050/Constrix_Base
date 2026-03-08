import { BannersRow } from "@/modules/stores/pages-setting/list/views/contact/types/banners-types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListBannersResponse extends ApiPaginatedResponse<
  BannersRow[]
> {}

export interface ShowBannerResponse extends ApiBaseResponse<BannersRow> {}
