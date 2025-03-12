import { useQuery } from "@tanstack/react-query";
import { fetchCurrencies } from "../services/LookupsService";

export const useCurrenciesData = () => {
  return useQuery({
    queryKey: [`currencies-data`],
    queryFn: fetchCurrencies,
  });
};
