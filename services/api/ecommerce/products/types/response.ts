import { ECM_Product } from "@/types/api/ecommerce/product";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListProductsResponse
  extends ApiPaginatedResponse<ECM_Product> {}

export interface ShowProductResponse extends ApiBaseResponse<ECM_Product> {}

export interface CreateProductResponse extends ApiBaseResponse<ECM_Product> {}

export interface UpdateProductResponse extends ApiBaseResponse<ECM_Product> {}
