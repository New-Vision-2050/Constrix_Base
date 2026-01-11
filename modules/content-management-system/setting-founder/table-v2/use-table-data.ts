import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CompanyDashboardFoundersApi } from "@/services/api/company-dashboard/founders";
import { FounderRow } from "../types";

/**
 * Custom hook for managing Founder table data and filters
 * Handles pagination, search, and API data fetching
 */
export function useTableData() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Extract founders from API response and cast to FounderRow
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

  // Search handler with page reset
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Limit handler with page reset
  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  // Reset all filters
  const handleReset = () => {
    setSearchQuery("");
    setPage(1);
  };

  return {
    founders,
    isLoading,
    page,
    limit,
    totalPages,
    totalItems,
    searchQuery,
    setPage,
    setLimit: handleLimitChange,
    handleSearchChange,
    handleReset,
    refetch,
  };
}
