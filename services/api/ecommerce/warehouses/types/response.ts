import { ECM_Warehouse } from "@/types/api/ecommerce/warehouse";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListWarehousesResponse
  extends ApiPaginatedResponse<ECM_Warehouse[]> {}

export interface ShowWarehouseResponse extends ApiBaseResponse<ECM_Warehouse> {}
