import { useQuery } from "@tanstack/react-query";
import getVacationPolicies from "../api/get-vacation-policy";

type Props = {
  limit?: number;
  page?: number;
};
/**
 * Custom hook for fetching constraints (approvers) using React Query
 * @returns Object containing constraints data, loading state, and error state
 */
export const useVacationPolicies = ({ limit, page }: Props) => {
  const queryKey = ["vacation-policies-data", limit, page];

  return useQuery({
    queryKey,
    queryFn: () => getVacationPolicies({ limit, page }),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
