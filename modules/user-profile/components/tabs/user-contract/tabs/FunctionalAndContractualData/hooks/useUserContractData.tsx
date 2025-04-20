import { useQuery } from "@tanstack/react-query";
import GetUserContractData from "../api/get-user-contract";

export default function useUserContractData(userId: string) {
  return useQuery({
    queryKey: [`user-contract-data`, userId],
    queryFn: () => GetUserContractData(userId),
  });
}
