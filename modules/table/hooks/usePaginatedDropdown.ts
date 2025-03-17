import { useState, useEffect, useCallback, useRef } from "react";
import {
  DropdownOption,
  DynamicDropdownConfig,
} from "@/modules/table/utils/tableTypes";
import { extractDropdownOptions } from "@/modules/table/components/table/dropdowns/DropdownUtils";
import { useFetchTracking, buildPaginatedUrl } from "./useFetchTracking";
import { useDebounce } from "./useDebounce";
import { apiClient } from "@/config/axios-config";
import { processApiResponse } from "@/modules/table/utils/dataUtils";

interface UsePaginatedDropdownProps {
  dynamicConfig?: DynamicDropdownConfig;
  dependencies?: Record<string, string>;
}

interface UsePaginatedDropdownResult {
  options: DropdownOption[];
  loading: boolean;
  error: string | null;
  searchValue: string;
  setSearchValue: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
  totalItems: number;
  fetchNextPage: () => void;
  refresh: () => void;
}

export const usePaginatedDropdown = ({
  dynamicConfig,
  dependencies,
}: UsePaginatedDropdownProps): UsePaginatedDropdownResult => {
  const [options, setOptions] = useState<DropdownOption[]>([]);
  const [allOptions, setAllOptions] = useState<DropdownOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const {
    isMountedRef,
    abortControllerRef,
    shouldFetchData,
    setupAbortController,
    cleanup,
  } = useFetchTracking();

  const isPaginationEnabled = dynamicConfig?.paginationEnabled ?? false;
  const itemsPerPage = dynamicConfig?.itemsPerPage ?? 10;
  const searchParam = dynamicConfig?.searchParam ?? "q";
  const pageParam = dynamicConfig?.pageParam ?? "page";
  const limitParam = dynamicConfig?.limitParam ?? "per_page";
  const totalCountHeader = dynamicConfig?.totalCountHeader ?? "x-total-count";

  // Function to manually trigger a refresh of options
  const refresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
    setPage(1);
    setOptions([]);
  }, []);

  // Search with debounce
  const debouncedSearch = useDebounce((value: string) => {
    // Reset pagination and options when search changes
    setPage(1);
    if (isPaginationEnabled) {
      setOptions([]);
    }
  }, 300);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchValue(value);
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  // Function to load the next page of results
  const fetchNextPage = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  // Memoizing the fetch function
  const fetchOptions = useCallback(
    async (url: string, isNewSearch: boolean, currentPage: number) => {
      try {
        console.log(`Fetching dropdown options (page ${currentPage}): ${url}`);

        const controller = setupAbortController();

        const response = await apiClient.get(url, {
          signal: controller.signal,
        });

        if (!isMountedRef.current) return { data: [], total: 0 };

        if (response.status !== 200)
          throw new Error(`Error ${response.status}: ${response.statusText}`);

        const total = response.headers[totalCountHeader];
        const totalCount = total ? parseInt(total, 10) : 0;

        const data = processApiResponse(await response.data);
        if (!Array.isArray(data)) throw new Error("Expected array response");

        const newOptions = extractDropdownOptions(
          data,
          dynamicConfig?.valueField || "id",
          dynamicConfig?.labelField || "name"
        );

        return { data: newOptions, total: totalCount };
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          console.log("Fetch aborted");
          return { data: [], total: 0 };
        }
        throw error;
      }
    },
    [dynamicConfig, setupAbortController, isMountedRef, totalCountHeader]
  );

  // Effect to fetch options whenever dependencies, search, or page changes
  useEffect(() => {
    if (!dynamicConfig) {
      setOptions([]);
      setLoading(false);
      return cleanup;
    }

    // Skip if dependency is required but not provided
    if (
      dynamicConfig.dependsOn &&
      (!dependencies || !dependencies[dynamicConfig.dependsOn])
    ) {
      setOptions([]);
      setLoading(false);
      return cleanup;
    }

    // Build additional params from dependencies
    const additionalParams: Record<string, string> = {};
    if (dynamicConfig.dependsOn && dependencies && dynamicConfig.filterParam) {
      additionalParams[dynamicConfig.filterParam] =
        dependencies[dynamicConfig.dependsOn];
    }

    // Build URL with pagination and search parameters
    const url = buildPaginatedUrl(
      dynamicConfig.url,
      searchValue,
      searchParam,
      page,
      itemsPerPage,
      pageParam,
      limitParam,
      additionalParams
    ).toString();

    // Create a signature for this request
    const paramsSignature = JSON.stringify({
      url: dynamicConfig.url,
      search: searchValue,
      page,
      dependencies,
    });

    // Skip fetch if identical request was just made
    if (!shouldFetchData(url, paramsSignature)) {
      return undefined;
    }

    // Determine if this is a new search (page 1)
    const isNewSearch = page === 1;

    setLoading(true);
    setError(null);

    fetchOptions(url, isNewSearch, page)
      .then(({ data: newOptions, total }) => {
        if (isMountedRef.current) {
          if (isPaginationEnabled) {
            // In pagination mode, we append new options or replace them if it's a new search
            setOptions((prev) =>
              isNewSearch ? newOptions : [...prev, ...newOptions]
            );
            setTotalItems(total);
            setHasMore(
              newOptions.length === itemsPerPage && page * itemsPerPage < total
            );
          } else {
            // Without pagination, we just replace the options
            setOptions(newOptions);
          }

          // Save all fetched options for filtering
          setAllOptions((prev) => {
            const combined = isNewSearch
              ? newOptions
              : [...prev, ...newOptions];
            // Remove duplicates by value
            const uniqueOptions = combined.filter(
              (option, index, self) =>
                index === self.findIndex((o) => o.value === option.value)
            );
            return uniqueOptions;
          });
        }
      })
      .catch((err) => {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : "Unknown error");
          console.log("Error fetching dropdown options:", err);
        }
      })
      .finally(() => {
        if (isMountedRef.current) {
          setLoading(false);
        }
      });

    return cleanup;
  }, [
    dynamicConfig,
    dependencies,
    searchValue,
    page,
    refreshCounter,
    isPaginationEnabled,
    itemsPerPage,
    searchParam,
    pageParam,
    limitParam,
    fetchOptions,
    shouldFetchData,
    cleanup,
    isMountedRef,
  ]);

  return {
    options,
    loading,
    error,
    searchValue,
    setSearchValue: handleSearchChange,
    page,
    setPage,
    hasMore,
    totalItems,
    fetchNextPage,
    refresh,
  };
};
