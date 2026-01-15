/**
 * Coupon Table Data Hook
 * Custom hook for fetching and managing coupon table data with React Query
 */

import { useQuery } from "@tanstack/react-query";
import { CouponsApi } from "./api";
import { Coupon } from "./types";

interface UseTableDataReturn {
  coupons: Coupon[];
  isLoading: boolean;
  totalPages: number;
  totalItems: number;
  refetch: () => void;
}

/**
 * Hook to fetch coupon data with pagination and search
 */
export function useTableData(
  page: number,
  limit: number,
  searchQuery: string
): UseTableDataReturn {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["coupons", page, limit, searchQuery],
    queryFn: () => CouponsApi.list(page, limit, searchQuery),
  });

  return {
    coupons: data?.data || [],
    isLoading,
    totalPages: data?.meta?.last_page || 0,
    totalItems: data?.meta?.total || 0,
    refetch,
  };
}
