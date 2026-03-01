import { useMemo } from "react";
import useCommunicationMessages from "../../hooks/useCommunicationMessages";
import { CommunicationMessage } from "../../types";

/**
 * Custom hook for fetching table data
 * Accepts pagination and filter parameters from parent component
 */
export function useTableData(
  page: number,
  limit: number,
  searchQuery: string,
  statusFilter: string
) {
  // Fetch data with filters
  const { data, isLoading, refetch } = useCommunicationMessages(
    page,
    limit,
    searchQuery || undefined,
    statusFilter !== "all" ? statusFilter : undefined
  );

  // Extract messages from API response
  const messages = useMemo<CommunicationMessage[]>(
    () => (data?.data?.payload || []) as unknown as CommunicationMessage[],
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
    messages,
    isLoading,
    totalPages,
    totalItems,
    refetch,
  };
}
