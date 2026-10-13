import { useMutation, useQueryClient } from "@tanstack/react-query";
import assignUserLeavePolicies from "../api/assign-user-leave-policies";
import { userLeavePoliciesQueryKey } from "./useUserLeavePolicies";

/**
 * Syncs the user's leave-policy assignments (full replacement semantics).
 * On success the balances table is re-rendered directly from the PUT
 * response, then the affected year queries are invalidated to stay in sync.
 */
export default function useAssignUserLeavePolicies(
  userId: string,
  year: number,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leavePolicyIds: string[]) =>
      assignUserLeavePolicies(userId, leavePolicyIds),
    onSuccess: (rows) => {
      // Re-render the table directly from the PUT response (an empty array
      // means all assignments were removed).
      if (Array.isArray(rows)) {
        queryClient.setQueryData(userLeavePoliciesQueryKey(userId, year), rows);
      }
      void queryClient.invalidateQueries({
        queryKey: ["user-leave-policies", userId],
      });
    },
  });
}
