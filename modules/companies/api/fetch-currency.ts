import { apiClient } from "@/config/axios-config";
import { Currency } from "@/types/currency";

type ResponseT = {
  code: string;
  message: string;
  payload: Currency[];
};

export default async function fetchCurrencies(countryId?: string) {
  const url = Boolean(countryId)
    ? `/currencies?country_id=${countryId}`
    : `/currencies`;

  const res = await apiClient.get<ResponseT>(url);

  return res.data.payload;
}
