import { useState, useCallback } from "react";
import { useQueryState, parseAsInteger, parseAsString } from "nuqs";
import { TableParams, TableParamsOptions } from "./types";

// ============================================================================
// Table Params Hook (Before Query)
// ============================================================================

export function createTableParamsHook(prefix?: string) {
  // If prefix provided, return nuqs-based hook
  if (prefix) {
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

      const [page, setPageUrl] = useQueryState(
        `${prefix}-p`,
        parseAsInteger.withDefault(initialPage).withOptions({
          history: "push",
          shallow: true,
          clearOnDefault: true,
        }),
      );

      const [limit, setLimitUrl] = useQueryState(
        `${prefix}-l`,
        parseAsInteger.withDefault(initialLimit).withOptions({
          history: "push",
          shallow: true,
          clearOnDefault: true,
        }),
      );

      const [sortBy, setSortByUrl] = useQueryState(
        `${prefix}-sb`,
        parseAsString.withOptions({
          history: "push",
          shallow: true,
          clearOnDefault: true,
        }),
      );

      const [sortDirection, setSortDirectionUrl] = useQueryState(
        `${prefix}-sd`,
        parseAsString.withOptions({
          history: "push",
          shallow: true,
          clearOnDefault: true,
        }),
      );

      const [search, setSearchUrl] = useQueryState(
        `${prefix}-s`,
        parseAsString
          .withOptions({
            history: "replace",
            shallow: true,
            clearOnDefault: true,
          })
          .withDefault(initialSearch),
      );

      const setPage = useCallback(
        (newPage: number) => {
          setPageUrl(newPage === initialPage ? null : newPage);
        },
        [initialPage, setPageUrl],
      );

      const setLimit = useCallback(
        (newLimit: number) => {
          setLimitUrl(newLimit === initialLimit ? null : newLimit);
          setPageUrl(null);
        },
        [initialLimit, setLimitUrl, setPageUrl],
      );

      const setSearch = useCallback(
        (newSearch: string) => {
          setSearchUrl(newSearch === "" ? null : newSearch);
          setPageUrl(null);
        },
        [setSearchUrl, setPageUrl],
      );

      const handleSort = useCallback(
        (key: string) => {
          const newDirection =
            sortBy === key && sortDirection === "asc" ? "desc" : "asc";
          setSortByUrl(key === initialSortBy ? null : key);
          setSortDirectionUrl(
            newDirection === initialSortDirection ? null : newDirection,
          );
        },
        [
          sortBy,
          sortDirection,
          initialSortBy,
          initialSortDirection,
          setSortByUrl,
          setSortDirectionUrl,
        ],
      );

      const reset = useCallback(() => {
        setPageUrl(null);
        setLimitUrl(null);
        setSortByUrl(null);
        setSortDirectionUrl(null);
        setSearchUrl(null);
      }, [
        setPageUrl,
        setLimitUrl,
        setSortByUrl,
        setSortDirectionUrl,
        setSearchUrl,
      ]);

      const nextPage = useCallback(
        () => setPage((page ?? initialPage) + 1),
        [page, setPage, initialPage],
      );
      const prevPage = useCallback(
        () => setPage(Math.max(1, (page ?? initialPage) - 1)),
        [page, setPage, initialPage],
      );

      return {
        page: page ?? initialPage,
        limit: limit ?? initialLimit,
        setPage,
        setLimit,
        nextPage,
        prevPage,
        sortBy: sortBy || undefined,
        sortDirection:
          (sortDirection as "asc" | "desc") || initialSortDirection,
        handleSort,
        search: search || "",
        setSearch,
        reset,
      };
    };
  }

  // Otherwise, return regular state-based hook
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
      setPage(1);
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
