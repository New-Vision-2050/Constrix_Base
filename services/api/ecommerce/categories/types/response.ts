import { ECM_Category } from "@/types/api/ecommerce/category";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListCategoriesResponse
  extends ApiPaginatedResponse<(ECM_Category & { parent: null })[]> {}

export interface ShowCategoryResponse extends ApiBaseResponse<ECM_Category> {}
