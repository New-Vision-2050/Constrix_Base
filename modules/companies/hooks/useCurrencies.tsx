import { useQuery } from "@tanstack/react-query";
import fetchCurrencies from "../api/fetch-currency";

export default function useCurrenciesData(countryId?: string) {
  return useQuery({
    queryKey: [`currencies-data`,countryId],
    queryFn: () => fetchCurrencies(countryId),
  });
}
