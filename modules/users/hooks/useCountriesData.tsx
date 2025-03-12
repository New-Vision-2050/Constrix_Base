import { useQuery } from "@tanstack/react-query";
import { fetchCountries } from "../services/LookupsService";

export const useCountriesData = () => {
  return useQuery({
    queryKey: [`countries-data`],
    queryFn: fetchCountries,
  });
};
