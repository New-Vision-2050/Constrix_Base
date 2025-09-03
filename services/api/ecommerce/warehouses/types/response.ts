import {
  ECM_Warehouse,
  ECM_Warehouse_ListItem,
} from "@/types/api/ecommerce/warehouse";
import { API_City } from "@/types/api/shared/city";
import { API_Country } from "@/types/api/shared/country";
import { ApiBaseResponse } from "@/types/common/response/base";
import { ApiPaginatedResponse } from "@/types/common/response/paginated";

export interface ListWarehousesResponse
  extends ApiPaginatedResponse<ECM_Warehouse_ListItem[]> {}

export interface ShowWarehouseResponse
  extends ApiBaseResponse<
    ECM_Warehouse & {
      country?: API_Country;
      city?: API_City;
    }
  > {}
