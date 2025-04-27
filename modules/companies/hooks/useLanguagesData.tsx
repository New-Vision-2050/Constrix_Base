import { useQuery } from "@tanstack/react-query";
import fetchLanguages from "../api/fetch-languages";

export default function useLanguagesData(countryId?: string) {
  return useQuery({
    queryKey: [`languages-data`,countryId],
    queryFn: () => fetchLanguages(countryId),
  });
}
