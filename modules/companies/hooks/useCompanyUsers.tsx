import { useQuery } from "@tanstack/react-query";
import { fetchCompanyUsers } from "../services/lookup-service";

export const useCompanyUsers = () => {
  return useQuery({
    queryKey: [`company-users-data`],
    queryFn: fetchCompanyUsers,
  });
};
