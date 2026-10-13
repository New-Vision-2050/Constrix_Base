import { apiClient } from "@/config/axios-config";
import { UserLeavePolicyBalance } from "../types";

type ResponseT = {
  status?: boolean;
  message?: string;
  payload?: UserLeavePolicyBalance[];
  data?: UserLeavePolicyBalance[];
};

/**
 * PUT /users/{userId}/leave-policies
 *
 * Sync semantics: the sent set REPLACES the user's assignments. Send the full
 * list of policy ids the user should end up with; an empty array removes all.
 *
 * The response carries the user's updated rows with balances (same shape as
 * the GET endpoint) so callers can re-render directly from it.
 */
export default async function assignUserLeavePolicies(
  userId: string,
  leavePolicyIds: string[],
): Promise<UserLeavePolicyBalance[]> {
  const res = await apiClient.put<ResponseT>(
    `/users/${userId}/leave-policies`,
    { leave_policy_ids: leavePolicyIds },
  );
  const rows = res.data?.payload ?? res.data?.data ?? [];
  return Array.isArray(rows) ? rows : [];
}
