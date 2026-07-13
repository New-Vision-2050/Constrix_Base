import { baseApi } from "@/config/axios/instances/base";
import { API_Country } from "@/types/api/shared/country";
import { ApiBaseResponse } from "@/types/common/response/base";

export interface CountryStateCityItem {
  id: string | number;
  name: string;
}

export interface GetCountryStatesCitiesParams {
  country_id?: string | number;
  state_id?: string | number;
  page?: number;
  per_page?: number;
  name?: string;
}

export const getCountries = () =>
  baseApi.get<ApiBaseResponse<API_Country[]>>("/countries");

export const getCountryStatesCities = (params?: GetCountryStatesCitiesParams) =>
  baseApi.get<ApiBaseResponse<CountryStateCityItem[]>>(
    "/countries/get-country-states-cities",
    { params },
  );

export const getStatesList = () =>
  baseApi.get<ApiBaseResponse<CountryStateCityItem[]>>("/countries/states/list");
