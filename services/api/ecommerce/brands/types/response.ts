import { ECM_Brand } from "@/types/api/ecommerce/brand";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListBrandsResponse extends ApiPaginatedResponse<ECM_Brand[]> {}

export interface ShowBrandResponse extends ApiBaseResponse<ECM_Brand> {}
