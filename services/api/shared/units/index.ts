import { baseApi } from "@/config/axios/instances/base";
import { API_Unit } from "@/types/api/shared/unit";
import { ApiBaseResponse } from "@/types/common/response/base";

export const getUnits = () =>
  baseApi.get<ApiBaseResponse<API_Unit[]>>("/units");
