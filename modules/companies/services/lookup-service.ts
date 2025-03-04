import { apiClient } from "@/config/axios-config";
import { apiUrl } from "../constant/base-url";
import { lookupsEndPoints } from "../constant/end-points";

export const fetchCountries = async () => {
  let url = apiUrl + lookupsEndPoints.countries;
  // ! The following line is a temporary override for testing purposes.
  // Remove it once the backend URL is stable and ready for production.
  url = `https://core-be-pr10.constrix-nv.com/api/v1${lookupsEndPoints.countries}`;
  const response = await apiClient.get(url);
  return response.data;
};
