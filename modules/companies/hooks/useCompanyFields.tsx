import { useQuery } from "@tanstack/react-query";
import { fetchCompanyFields } from "../services/lookup-service";

export const useCompanyFields = () => {
  return useQuery({
    queryKey: [`company-fields-data`],
    queryFn: fetchCompanyFields,
  });
};
