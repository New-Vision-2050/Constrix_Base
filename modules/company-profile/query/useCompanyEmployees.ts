import { useQuery } from "@tanstack/react-query";
import { getCompanyEmployees } from "../service/get-company-employees";

export const useCompanyEmployees = () => {
  return useQuery({
    queryKey: ["company-employees"],
    queryFn: () => getCompanyEmployees(),
  });
};
