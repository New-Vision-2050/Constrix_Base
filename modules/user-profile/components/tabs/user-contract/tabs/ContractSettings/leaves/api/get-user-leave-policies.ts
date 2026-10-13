import { apiClient } from "@/config/axios-config";
import { UserLeavePolicyBalance } from "../types";

type ResponseT = {
  status?: boolean;
  message?: string;
  payload?: UserLeavePolicyBalance[];
  data?: UserLeavePolicyBalance[];
};

/**
 * GET /users/{userId}/leave-policies?year=
 * Returns the user's assigned leave policies with live per-year balances.
 */
export default async function getUserLeavePolicies(
  userId: string,
  year: number,
): Promise<UserLeavePolicyBalance[]> {
  const res = await apiClient.get<ResponseT>(
    `/users/${userId}/leave-policies`,
    { params: { year } },
  );
  const rows = res.data?.payload ?? res.data?.data ?? [];
  return Array.isArray(rows) ? rows : [];
}
