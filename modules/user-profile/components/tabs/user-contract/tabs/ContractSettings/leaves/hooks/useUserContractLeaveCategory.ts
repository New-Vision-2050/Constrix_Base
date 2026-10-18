import { useQuery } from "@tanstack/react-query";
import GetUserEmploymentContractData from "../../../FunctionalAndContractualData/api/get-user-employment-contract";

export default function useUserContractLeaveCategory(userId: string) {
  return useQuery({
    queryKey: ["user-contract-leave-category", userId],
    queryFn: async () => {
      const contract = await GetUserEmploymentContractData(userId);
      return contract?.leave_category ?? null;
    },
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
}
