import { useState, useMemo } from "react";
import useCommunicationMessages from "../../hooks/useCommunicationMessages";
import { CommunicationMessage } from "../../types";

/**
 * Custom hook for managing table data and filters
 * Handles pagination, search, and status filtering
 */
export function useTableData() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch data with filters
  const { data, isLoading, refetch } = useCommunicationMessages(
    page,
    limit,
    searchQuery || undefined,
    statusFilter !== "all" ? statusFilter : undefined
  );

  // Extract pagination info from API response
  const messages = useMemo<CommunicationMessage[]>(
    () => data?.data?.payload || [],
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

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPage(1);
  };

  return {
    messages,
    isLoading,
    page,
    limit,
    totalPages,
    totalItems,
    searchQuery,
    statusFilter,
    setPage,
    handleSearchChange,
    handleStatusChange,
    handleReset,
    refetch,
  };
}
