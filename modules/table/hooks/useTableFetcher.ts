
import { useCallback } from 'react';
import { SearchConfig, ColumnSearchState } from '@/modules/table/utils/tableTypes';
import { ColumnConfig } from '@/modules/table/utils/tableConfig';
import { 
  processApiResponse,
  extractColumnsFromData 
} from '@/modules/table/utils/dataUtils';
import {
  buildRequestUrl,
  createFetchOptions,
  setupRequestTimeout
} from '@/modules/table/utils/requestUtils';

type FetchDataBaseProps = {
  url: string;
  currentPage: number;
  itemsPerPage: number;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  searchQuery: string;
  searchFields?: string[];
  columnSearchState?: ColumnSearchState;
  searchConfig?: SearchConfig;
  isMountedRef: React.MutableRefObject<boolean>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  configColumns?: ColumnConfig[];
};

type FetchDataAdditionalProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTotalItems: (totalItems: number) => void;
  setPagination: (currentPage: number, totalPages: number, itemsPerPage: number) => void;
  setColumns: (columns: ColumnConfig[]) => void;
  setData: (data: any[]) => void;
  dataMapper?: (data: any) => any[];
};

type FetchDataProps = FetchDataBaseProps & FetchDataAdditionalProps;

export const createTableFetcher = () => {
  let requestCounter = 0;
  
  const fetchData = useCallback(async (props: FetchDataProps) => {
    const {
      url,
      currentPage,
      itemsPerPage,
      sortColumn,
      sortDirection,
      searchQuery,
      searchFields,
      columnSearchState = {},
      searchConfig,
      isMountedRef,
      abortControllerRef,
      configColumns,
      setLoading,
      setError,
      setTotalItems,
      setPagination,
      setColumns,
      setData,
      dataMapper
    } = props;
    
    if (!url) return;
    
    const currentRequestId = ++requestCounter;
    
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = buildRequestUrl(
        url,
        currentPage,
        itemsPerPage,
        sortColumn,
        sortDirection,
        searchQuery,
        searchFields,
        columnSearchState,
        searchConfig
      );
      
      console.log(`Fetching data from: ${apiUrl.toString()}`);
      
      const controller = abortControllerRef.current;
      if (!controller) return;
      
      const timeoutId = setupRequestTimeout(controller, () => {
        if (isMountedRef.current && abortControllerRef.current === controller) {
          setError('Request timed out');
          setLoading(false);
        }
      });
      
      const response = await fetch(
        apiUrl.toString(), 
        createFetchOptions(controller)
      );
      
      clearTimeout(timeoutId);
      
      if (!isMountedRef.current || requestCounter !== currentRequestId) {
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }
      
      const totalCount = response.headers.get('x-total-count');
      const totalItemsCount = totalCount ? parseInt(totalCount, 10) : 0;
      
      if (isMountedRef.current && requestCounter === currentRequestId) {
        setTotalItems(totalItemsCount);
        
        if (totalItemsCount > 0) {
          const calculatedTotalPages = Math.ceil(totalItemsCount / itemsPerPage);
          setPagination(currentPage, calculatedTotalPages, itemsPerPage);
        }
      }
      
      const result = await response.json();
      let tableData = processApiResponse(result);
      
      if (!isMountedRef.current || requestCounter !== currentRequestId) {
        return;
      }
      
      if (!totalCount && tableData.length > 0) {
        if (isMountedRef.current && requestCounter === currentRequestId) {
          setTotalItems(tableData.length);
          const calculatedTotalPages = Math.ceil(tableData.length / itemsPerPage);
          setPagination(currentPage, calculatedTotalPages, itemsPerPage);
        }
      } else if (!totalCount && tableData.length === 0) {
        if (isMountedRef.current && requestCounter === currentRequestId) {
          setError('No data found or data format not supported');
        }
      }
      
      if (dataMapper) {
        tableData = dataMapper(tableData);
      }
      
      if (isMountedRef.current && requestCounter === currentRequestId) {
        if (configColumns && configColumns.length > 0) {
          setColumns(configColumns);
        } else if (tableData.length > 0) {
          const sampleRow = tableData[0];
          const extractedColumns = extractColumnsFromData(sampleRow);
          setColumns(extractedColumns);
        }
        
        setData(tableData);
        setLoading(false);
      }
      
    } catch (err: any) {
      if (isMountedRef.current && requestCounter === currentRequestId && !(err instanceof Error && err.name === 'AbortError')) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setData([]);
        setLoading(false);
      }
    }
  }, []);

  return { fetchData };
};
