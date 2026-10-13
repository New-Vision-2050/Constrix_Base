import { apiClient } from "@/config/axios-config";
import { AdvancePolicy } from "../types/AdvancePolicy";

/** All company advance policies (first page of 100) — used by pickers/filters. */
export default async function getAdvancePolicies(): Promise<AdvancePolicy[]> {
  const res = await apiClient.get<{ payload?: AdvancePolicy[] }>(
    "/advance-policies",
    { params: { page: 1, per_page: 100 } },
  );
  const rows = res.data?.payload ?? [];
  return Array.isArray(rows) ? rows : [];
}
