import { apiClient } from "@/config/axios-config";
import { Language } from "@/types/languages";

type ResponseT = {
  code: string;
  message: string;
  payload: Language[];
};

export default async function fetchLanguages(countryId?: string) {
  const url = Boolean(countryId)
    ? `/languages?country_id=${countryId}`
    : `/languages`;

  const res = await apiClient.get<ResponseT>(url);

  return res.data.payload;
}
