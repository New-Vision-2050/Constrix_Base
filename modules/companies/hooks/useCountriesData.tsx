import { useQuery } from "@tanstack/react-query";
import { fetchCountries } from "../services/lookup-service";

export const useCountriesData = () => {
  return useQuery({
    queryKey: [`countries-lookups-data`],
    queryFn: fetchCountries,
  });
};
