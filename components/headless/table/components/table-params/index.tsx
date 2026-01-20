import { useState, useCallback } from "react";
import { TableParams, TableParamsOptions } from "./types";

// ============================================================================
// Table Params Hook (Before Query)
// ============================================================================

export function createTableParamsHook() {
  return function useTableParams(
    options: TableParamsOptions = {},
  ): TableParams {
    const {
      initialPage = 1,
      initialLimit = 10,
      initialSortBy,
      initialSortDirection = "asc",
      initialSearch = "",
    } = options;

    // Pagination state
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    // Sorting state
    const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
      initialSortDirection,
    );

    // Search state
    const [search, setSearch] = useState<string>(initialSearch);

    // Pagination actions
    const nextPage = useCallback(() => {
      setPage((p) => p + 1);
    }, []);

    const prevPage = useCallback(() => {
      setPage((p) => Math.max(1, p - 1));
    }, []);

    const handleSetLimit = useCallback((newLimit: number) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when limit changes
    }, []);

    const handleSetSearch = useCallback((newSearch: string) => {
      setSearch(newSearch);
      setPage(1); // Reset to first page when search changes
    }, []);

    // Sorting handler
    const handleSort = useCallback(
      (key: string) => {
        if (sortBy === key) {
          // Toggle direction if same column
          setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
          // New column, default to asc
          setSortBy(key);
          setSortDirection("asc");
        }
      },
      [sortBy],
    );

    // Reset all params
    const reset = useCallback(() => {
      setPage(initialPage);
      setLimit(initialLimit);
      setSortBy(initialSortBy);
      setSortDirection(initialSortDirection);
      setSearch(initialSearch);
    }, [
      initialPage,
      initialLimit,
      initialSortBy,
      initialSortDirection,
      initialSearch,
    ]);

    return {
      page,
      limit,
      setPage,
      setLimit: handleSetLimit,
      nextPage,
      prevPage,
      sortBy,
      sortDirection,
      handleSort,
      search,
      setSearch: handleSetSearch,
      reset,
    };
  };
}
