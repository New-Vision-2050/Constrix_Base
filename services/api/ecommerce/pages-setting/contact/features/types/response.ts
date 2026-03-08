import { FeaturesRow } from "@/modules/stores/pages-setting/list/views/contact/types/features-types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListFeaturesResponse extends ApiPaginatedResponse<
  FeaturesRow[]
> {}

export interface ShowFeatureResponse extends ApiBaseResponse<FeaturesRow> {}
