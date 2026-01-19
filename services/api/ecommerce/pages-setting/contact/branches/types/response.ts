import { BranchRow } from "@/modules/stores/pages-setting/list/views/contact/types/branch-types";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListBranchesResponse
  extends ApiPaginatedResponse<BranchRow[]> {}

export interface ShowBranchResponse extends ApiBaseResponse<BranchRow> {}
