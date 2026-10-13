import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assignUserAdvancePolicies,
  getAdvanceRequest,
  getUserAdvancePolicies,
  getUserAdvanceRequests,
} from "../api";

export function userAdvancePoliciesQueryKey(userId: string) {
  return ["user-advance-policies", userId] as const;
}

export function useUserAdvancePolicies(userId: string) {
  return useQuery({
    queryKey: userAdvancePoliciesQueryKey(userId),
    queryFn: () => getUserAdvancePolicies(userId),
    enabled: Boolean(userId),
    refetchOnWindowFocus: false,
  });
}

export function useAssignUserAdvancePolicies(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (advancePolicyIds: string[]) =>
      assignUserAdvancePolicies(userId, advancePolicyIds),
    onSuccess: (rows) => {
      queryClient.setQueryData(userAdvancePoliciesQueryKey(userId), rows);
    },
  });
}

export function useUserAdvanceRequests(filters: {
  userId: string;
  status?: string;
  advancePolicyId?: string;
  page: number;
  perPage: number;
}) {
  return useQuery({
    queryKey: ["user-advance-requests", filters],
    queryFn: () => getUserAdvanceRequests(filters),
    enabled: Boolean(filters.userId),
    refetchOnWindowFocus: false,
    placeholderData: (previous) => previous,
  });
}

export function useAdvanceRequest(id: string | null) {
  return useQuery({
    queryKey: ["advance-request", id],
    queryFn: () => getAdvanceRequest(id as string),
    enabled: Boolean(id),
    refetchOnWindowFocus: false,
  });
}
