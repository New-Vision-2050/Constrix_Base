import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListCategoriesResponse extends ApiPaginatedResponse<any> {}

export interface ShowCategoryResponse extends ApiBaseResponse<any> {}
