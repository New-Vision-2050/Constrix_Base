import { useQuery } from "@tanstack/react-query";
import GetUserEmploymentContractData from "../api/get-user-employment-contract";

export default function useUserEmploymentContractData(userId: string) {
  return useQuery({
    queryKey: [`user-employment-contract-data`, userId],
    queryFn: () => GetUserEmploymentContractData(userId),
    enabled: !!userId,
  });
}
