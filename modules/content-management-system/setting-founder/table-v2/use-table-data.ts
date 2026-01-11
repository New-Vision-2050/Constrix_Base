import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CompanyDashboardFoundersApi } from "@/services/api/company-dashboard/founders";
import { FounderRow } from "../types";

/**
 * Custom hook for fetching Founder table data
 * Accepts pagination and filter parameters from parent component
 */
export function useTableData(
  page: number,
  limit: number,
  searchQuery: string
) {
  // Fetch data with filters
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["founders", page, limit, searchQuery],
    queryFn: () =>
      CompanyDashboardFoundersApi.list({
        page,
        per_page: limit,
        search: searchQuery || undefined,
      }),
  });

  // Extract founders from API response
  const founders = useMemo<FounderRow[]>(
    () => (data?.data?.payload || []) as unknown as FounderRow[],
    [data]
  );

  const totalPages = useMemo(
    () => data?.data?.pagination?.last_page || 1,
    [data]
  );

  const totalItems = useMemo(
    () => data?.data?.pagination?.result_count || 0,
    [data]
  );

  return {
    founders,
    isLoading,
    totalPages,
    totalItems,
    refetch,
  };
}
