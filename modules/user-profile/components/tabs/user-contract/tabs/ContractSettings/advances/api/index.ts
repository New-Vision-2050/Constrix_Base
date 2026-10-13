import { apiClient } from "@/config/axios-config";
import {
  AdvanceRequest,
  PaginatedAdvanceRequests,
  UserAdvancePolicy,
} from "../types";

type ListResponseT<T> = {
  payload?: T[];
  pagination?: { last_page?: number };
};

type SingleResponseT<T> = {
  payload?: T;
};

/** GET /users/{userId}/advance-policies — assigned policies with live availability. */
export async function getUserAdvancePolicies(
  userId: string,
): Promise<UserAdvancePolicy[]> {
  const res = await apiClient.get<ListResponseT<UserAdvancePolicy>>(
    `/users/${userId}/advance-policies`,
  );
  const rows = res.data?.payload ?? [];
  return Array.isArray(rows) ? rows : [];
}

/**
 * PUT /users/{userId}/advance-policies
 *
 * Sync semantics: the sent set REPLACES the user's assignments (empty array
 * removes all). The response carries the updated rows.
 */
export async function assignUserAdvancePolicies(
  userId: string,
  advancePolicyIds: string[],
): Promise<UserAdvancePolicy[]> {
  const res = await apiClient.put<ListResponseT<UserAdvancePolicy>>(
    `/users/${userId}/advance-policies`,
    { advance_policy_ids: advancePolicyIds },
  );
  const rows = res.data?.payload ?? [];
  return Array.isArray(rows) ? rows : [];
}

export type GetUserAdvanceRequestsArgs = {
  userId: string;
  status?: string;
  advancePolicyId?: string;
  page?: number;
  perPage?: number;
};

/** GET /advance-requests?user_id=&status=&advance_policy_id=&page=&per_page= */
export async function getUserAdvanceRequests({
  userId,
  status,
  advancePolicyId,
  page = 1,
  perPage = 10,
}: GetUserAdvanceRequestsArgs): Promise<PaginatedAdvanceRequests> {
  const res = await apiClient.get<ListResponseT<AdvanceRequest>>(
    "/advance-requests",
    {
      params: {
        user_id: userId,
        ...(status ? { status } : {}),
        ...(advancePolicyId ? { advance_policy_id: advancePolicyId } : {}),
        page,
        per_page: perPage,
      },
    },
  );
  const rows = res.data?.payload ?? [];

  return {
    rows: Array.isArray(rows) ? rows : [],
    lastPage: res.data?.pagination?.last_page ?? 1,
  };
}

/** GET /advance-requests/{id} — detail view. */
export async function getAdvanceRequest(id: string): Promise<AdvanceRequest | null> {
  const res = await apiClient.get<SingleResponseT<AdvanceRequest>>(
    `/advance-requests/${id}`,
  );
  return res.data?.payload ?? null;
}
