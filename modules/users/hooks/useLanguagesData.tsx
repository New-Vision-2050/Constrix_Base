import { useQuery } from "@tanstack/react-query";
import { fetchLanguages } from "../services/LookupsService";

export const useLanguagesData = () => {
  return useQuery({
    queryKey: [`languages-data`],
    queryFn: fetchLanguages,
  });
};
