import { useQuery } from "@tanstack/react-query";
import GetUserBankingData from "../api/get-banking-data";

export default function useUserBankingData(userId: string) {
  return useQuery({
    queryKey: [`user-banking-data`, userId],
    queryFn: () => GetUserBankingData(userId),
  });
}
