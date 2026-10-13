import { useQuery } from "@tanstack/react-query";
import getUserLeavePolicies from "../api/get-user-leave-policies";

export function userLeavePoliciesQueryKey(userId: string, year: number) {
  return ["user-leave-policies", userId, year] as const;
}

/**
 * Fetches the user's assigned leave policies with live balances for `year`.
 * Balances renew every calendar year automatically — the year selector simply
 * re-calls the endpoint with a different `?year=`.
 */
export default function useUserLeavePolicies(userId: string, year: number) {
  return useQuery({
    queryKey: userLeavePoliciesQueryKey(userId, year),
    queryFn: () => getUserLeavePolicies(userId, year),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
}
