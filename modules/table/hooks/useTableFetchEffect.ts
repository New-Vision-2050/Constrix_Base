import { useEffect, useRef } from 'react';
import { ColumnConfig } from '@/modules/table/utils/tableConfig';
import { SearchConfig, ColumnSearchState } from '@/modules/table/utils/tableTypes';
import { useFetchTracking } from './useFetchTracking';

// Add a debounce timeout to prevent multiple fetches
let debounceTimeout: NodeJS.Timeout | null = null;
// Keep track of the last fetch parameters to avoid duplicate fetches
let lastFetchParams = '';
// Flag to track if a fetch is in progress
let fetchInProgress = false;
// Store the last fetch time to prevent rapid fetches
let lastFetchTime = 0;

interface TableFetchEffectProps {
  url: string;
  currentPage: number;
  itemsPerPage: number;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  searchQuery: string;
  searchFields?: string[];
  columnSearchState: ColumnSearchState;
  searchConfig?: SearchConfig;
  fetchData: (params: any) => void;
  setData: (data: any[]) => void;
  setColumns: (columns: ColumnConfig[]) => void;
  setError: (error: string | null) => void;
  setIsFirstLoad: (isFirstLoad: boolean) => void;
  configColumns?: ColumnConfig[];
  _forceRefetch?: number; // Add _forceRefetch property
  apiParams?: Record<string, string>;
}

export const useTableFetchEffect = ({
  url,
  apiParams,
  currentPage,
  itemsPerPage,
  sortColumn,
  sortDirection,
  searchQuery,
  searchFields,
  columnSearchState,
  searchConfig,
  fetchData,
  setData,
  setColumns,
  setError,
  setIsFirstLoad,
  configColumns,
  _forceRefetch
}: TableFetchEffectProps) => {
  const {
    isMountedRef,
    abortControllerRef,
    shouldFetchData,
    setupAbortController,
    cleanup
  } = useFetchTracking();

  // Fetch data when dependencies change
  useEffect(() => {
    if (!url) return;

    // Create a signature of the current request parameters
    const currentParamsSignature = JSON.stringify({
      url,
      currentPage,
      itemsPerPage,
      sortColumn,
      sortDirection,
      searchQuery,
      searchFields,
      columnSearchState,
      _forceRefetch
    });

    // Check if this is an initialization reload
    const isInitReload = typeof window !== 'undefined' && (window as any).__tableInitReload;

    // If this is the same as the last fetch, skip it
    // But allow it if it's a force refetch or initialization reload
    if (currentParamsSignature === lastFetchParams && !_forceRefetch && !isInitReload) {
      if (process.env.NODE_ENV === 'development') {
        console.log("[TableFetch] Skipping duplicate fetch - same parameters");
      }
      return;
    }

    // Additional check: if a fetch is already in progress with the same parameters, skip
    if (fetchInProgress && currentParamsSignature === lastFetchParams) {
      if (process.env.NODE_ENV === 'development') {
        console.log("[TableFetch] Skipping duplicate fetch - already in progress");
      }
      return;
    }

    // If this is an initialization reload, log it
    if (isInitReload && process.env.NODE_ENV === 'development') {
      console.log("[TableFetch] Processing initialization reload");
    }

    // Clear any pending debounce timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
      debounceTimeout = null;
    }

    // Set a new debounce timeout with longer delay to better prevent race conditions
    debounceTimeout = setTimeout(() => {
      // Double-check if parameters are still the same after debounce
      const latestParamsSignature = JSON.stringify({
        url,
        currentPage,
        itemsPerPage,
        sortColumn,
        sortDirection,
        searchQuery,
        searchFields,
        columnSearchState,
        _forceRefetch
      });

      // If parameters changed during debounce, skip this fetch
      if (latestParamsSignature !== currentParamsSignature) {
        if (process.env.NODE_ENV === 'development') {
          console.log("[TableFetch] Parameters changed during debounce, skipping fetch");
        }
        return;
      }

      // Update the last fetch params
      lastFetchParams = currentParamsSignature;

      // Only log on development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[TableFetch] Fetching data for ${url} (page ${currentPage})`);
        console.log(`[TableFetch] Params: ${currentParamsSignature}`);
      }

      // Proceed with the fetch
      performFetch();
    }, 200); // Increased debounce time to better prevent race conditions

    // Function to perform the actual fetch
    function performFetch() {
      // Check if a fetch is already in progress
      if (fetchInProgress) {
        if (process.env.NODE_ENV === 'development') {
          console.log("[TableFetch] Fetch already in progress, skipping");
        }
        return;
      }

      // Check if we've fetched too recently (within 500ms to prevent rapid successive calls)
      const now = Date.now();
      if (now - lastFetchTime < 500 && !_forceRefetch) {
        if (process.env.NODE_ENV === 'development') {
          console.log("[TableFetch] Fetch too recent, skipping");
        }
        return;
      }

      // Update the last fetch time
      lastFetchTime = now;

      if (!shouldFetchData(url, currentParamsSignature)) {
        if (process.env.NODE_ENV === 'development') {
          console.log("[TableFetch] Fetch tracking prevented duplicate fetch");
        }
        return;
      }

      // Set the fetch in progress flag
      fetchInProgress = true;

      // Reset certain parts of the state when URL changes
      if (url !== (abortControllerRef.current as any)?.lastUrl) {
        // Check if we have cached data for this URL in the activeRequestsMap
        // If not, reset the data
        const cachedRequest = (window as any).activeRequestsMap?.get?.(url);
        if (!cachedRequest) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[TableFetch] No cached data found for URL, resetting state');
          }
          setData([]);
          // Don't reset columns here if they're provided in config or if we're doing a reload
          if (!configColumns || configColumns.length === 0) {
            // Only reset columns if this is not a force refetch (reload)
            if (!_forceRefetch) {
              setColumns([]);
            }
          }
          setError(null);
          setIsFirstLoad(true);
        } else if (process.env.NODE_ENV === 'development') {
          console.log('[TableFetch] Found cached request for URL, reusing data');
        }
      }

      const controller = setupAbortController();
      // Attach the URL to the controller itself, not to the signal
      (controller as any).lastUrl = url;

      // Make sure to include columnSearchState in the fetch parameters
      const originalFetchData = fetchData;

      // Wrap the fetchData function to clear the fetchInProgress flag when done
      const wrappedFetchData = (params: any) => {
        // Call the original fetchData function
        originalFetchData(params);

        // Clear the fetch in progress flag after a short delay
        setTimeout(() => {
          fetchInProgress = false;
          if (process.env.NODE_ENV === 'development') {
            console.log("[TableFetch] Fetch completed, cleared in-progress flag");
          }
        }, 500);
      };

      // Call the wrapped fetchData function
      wrappedFetchData({
        url,
        apiParams,
        currentPage,
        itemsPerPage,
        sortColumn,
        sortDirection,
        searchQuery,
        searchFields,
        columnSearchState,
        searchConfig,
        isMountedRef,
        abortControllerRef,
        configColumns,
        _forceRefetch
      });
    }

    // Cleanup when unmounting or when dependencies change
    return () => {
      // Clear any pending debounce timeout
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
        debounceTimeout = null;
      }

      // Run the regular cleanup
      cleanup();
    };
  }, [url, currentPage, itemsPerPage, sortColumn, sortDirection, searchQuery, searchFields, columnSearchState, _forceRefetch]);
};
