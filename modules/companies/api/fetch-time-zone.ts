import { apiClient } from "@/config/axios-config";
import { TimeZone } from "@/types/time-zone";

type ResponseT = {
  code: string;
  message: string;
  payload: TimeZone[];
};

export default async function fetchTimeZones(countryId?: string) {
  const url = Boolean(countryId)
    ? `/countries/time-zones?country_id=${countryId}`
    : `/countries/time-zones`;

  const res = await apiClient.get<ResponseT>(url);

  return res.data.payload;
}
