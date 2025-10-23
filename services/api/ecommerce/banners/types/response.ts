import { ECM_Banner } from "@/types/api/ecommerce/banner";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListBannersResponse extends ApiPaginatedResponse<ECM_Banner[]> {}

export interface ShowBannerResponse extends ApiBaseResponse<ECM_Banner> {}
