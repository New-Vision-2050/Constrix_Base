import { apiClient } from "@/config/axios-config";

/**
 * Fetches dropdown options for filters
 */
export const fetchDropdownOptions = async (
  url: string,
  searchParam?: string,
  searchValue?: string
): Promise<any[]> => {
  const params: any = { per_page: 10 };
  if (searchParam && searchValue) {
    params[searchParam] = searchValue;
  }

  const response = await apiClient.get(url, { params });
  return response.data.payload || [];
};

/** Normalized row from `management_hierarchies/list` (id + name; no `value` field). */
export type ManagementHierarchyOption = { id: string; name: string };

/**
 * Fetches management hierarchy list and maps API `{ id, name, ... }` to stable string ids
 * for MUI Select (avoids undefined `value` when using a non-existent `value` key).
 */
export async function fetchManagementHierarchyOptions(
  url: string,
  searchParam?: string,
  searchValue?: string,
): Promise<ManagementHierarchyOption[]> {
  const rows = await fetchDropdownOptions(url, searchParam, searchValue);
  return (Array.isArray(rows) ? rows : [])
    .map((row: { id?: unknown; name?: unknown }) => ({
      id: String(row.id ?? ""),
      name: String(row.name ?? "").trim(),
    }))
    .filter((m) => m.id.length > 0);
}
