import { baseApi } from "@/config/axios/instances/base";
import { API_Country } from "@/types/api/shared/country";
import { ApiBaseResponse } from "@/types/common/response/base";

export const getCountries = () =>
  baseApi.get<ApiBaseResponse<API_Country[]>>("/countries");
