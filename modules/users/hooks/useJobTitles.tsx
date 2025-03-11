import { useQuery } from "@tanstack/react-query";
import { fetchJobTitles } from "../services/LookupsService";

export const useJobTitles = () => {
  return useQuery({
    queryKey: [`job-titles-data`],
    queryFn: fetchJobTitles,
  });
};
