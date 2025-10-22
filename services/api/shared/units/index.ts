import { baseApi } from "@/config/axios/instances/base";
import { API_Country } from "@/types/api/shared/country";
import { ApiBaseResponse } from "@/types/common/response/base";

export const getUnits = () =>
  baseApi.get<ApiBaseResponse<API_Country[]>>("/units");
