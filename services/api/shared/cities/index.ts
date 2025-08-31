import { baseApi } from "@/config/axios/instances/base";
import { API_City } from "@/types/api/shared/city";
import { ApiBaseResponse } from "@/types/common/response/base";

export const getCities = () =>
  baseApi.get<ApiBaseResponse<API_City[]>>("/countries/cities");
