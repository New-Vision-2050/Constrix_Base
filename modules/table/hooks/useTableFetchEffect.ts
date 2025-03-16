
import { useEffect } from 'react';
import { ColumnConfig } from '@/modules/table/utils/tableConfig';
import { SearchConfig, ColumnSearchState } from '@/modules/table/utils/tableTypes';
import { useFetchTracking } from './useFetchTracking';

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
}

export const useTableFetchEffect = ({
  url,
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
  configColumns
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
      columnSearchState
    });
    
    // Add logging to debug columnSearchState changes
    console.log("Effect triggered with columnSearchState:", columnSearchState);
    
    if (!shouldFetchData(url, currentParamsSignature)) {
      console.log("Skipping fetch due to duplicate parameters");
      return;
    }
    
    // Reset certain parts of the state when URL changes
    // Instead of accessing signal.url, we'll store the current URL in a custom property on the controller itself
    if (url !== (abortControllerRef.current as any)?.lastUrl) {
      // Check if we have cached data for this URL in the activeRequestsMap
      // If not, reset the data
      const cachedRequest = (window as any).activeRequestsMap?.get?.(url);
      if (!cachedRequest) {
        console.log('No cached data found for URL, resetting state');
        setData([]);
        // Don't reset columns here if they're provided in config
        if (!configColumns || configColumns.length === 0) {
          setColumns([]);
        }
        setError(null);
        setIsFirstLoad(true);
      } else {
        console.log('Found cached request for URL, reusing data');
      }
    }
    
    console.log(`Fetching data with params: ${currentParamsSignature}`);
    
    const controller = setupAbortController();
    // Attach the URL to the controller itself, not to the signal
    (controller as any).lastUrl = url;
    
    fetchData({
      url,
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
      configColumns
    });
    
    // Cleanup when unmounting or when dependencies change
    return cleanup;
  }, [url, currentPage, itemsPerPage, sortColumn, sortDirection, searchQuery, searchFields, JSON.stringify(columnSearchState)]);
};
