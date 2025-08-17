import {
  SearchConfig,
  ColumnSearchState,
} from "@/modules/table/utils/tableTypes";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import {
  processApiResponse,
  extractColumnsFromData,
} from "@/modules/table/utils/dataUtils";
import {
  buildRequestUrl,
  setupRequestTimeout,
} from "@/modules/table/utils/requestUtils";
import { baseApi } from "@/config/axios/instances/base";

type FetchDataBaseProps = {
  url: string;
  currentPage: number;
  itemsPerPage: number;
  sortColumn: string | null;
  sortDirection: "asc" | "desc" | null;
  searchQuery: string;
  searchFields?: string[];
  columnSearchState?: ColumnSearchState;
  searchConfig?: SearchConfig;
  isMountedRef: React.MutableRefObject<boolean>;
  abortControllerRef: React.MutableRefObject<AbortController | null>;
  configColumns?: ColumnConfig[];
  _forceRefetch?: number; // Add _forceRefetch property
  apiParams?: Record<string, string>;
};

type FetchDataAdditionalProps = {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setTotalItems: (totalItems: number) => void;
  setPagination: (
    currentPage: number,
    totalPages: number,
    itemsPerPage: number
  ) => void;
  setColumns: (columns: ColumnConfig[]) => void;
  setData: (data: any[]) => void;
  dataMapper?: (data: any) => any[];
};

type FetchDataProps = FetchDataBaseProps & FetchDataAdditionalProps;

export const createTableFetcher = () => {
  let requestCounter = 0;

  const fetchData = async (props: FetchDataProps) => {
    const {
      url,
      apiParams,
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
      _forceRefetch, // Extract _forceRefetch property
      setLoading,
      setError,
      setTotalItems,
      setPagination,
      setColumns,
      setData,
      dataMapper,
    } = props;
    
    // Log force refetch if present
    if (_forceRefetch && process.env.NODE_ENV === 'development') {
      console.log(`[TableFetcher] Force refetch requested: ${_forceRefetch}`);
    }

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
        searchConfig,
        apiParams,
      );

      console.log(`Fetching data from: ${apiUrl.toString()}`);

      const controller = abortControllerRef.current;
      if (!controller) return;

      const timeoutId = setupRequestTimeout(controller, () => {
        if (isMountedRef.current && abortControllerRef.current === controller) {
          setError("Request timed out");
          setLoading(false);
        }
      });

      // Use baseApi instead of fetch
      const response = await baseApi.get(apiUrl.toString(), {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!isMountedRef.current) {
        // Component unmounted, but we'll still process the response
        // to cache it for when the user returns to this page
        console.log(
          "Component unmounted but continuing to process response for caching"
        );
      } else if (requestCounter !== currentRequestId) {
        // A newer request has been made, ignore this response
        return;
      }

      // Extract total count from Axios response headers
      const totalCount = response.headers["x-total-count"];
      const totalItemsCount = totalCount ? parseInt(totalCount, 10) : 0;

      // Always process the response, even if the component is unmounted
      // This ensures the data is cached for when the user returns to this page
      setTotalItems(totalItemsCount);
      // Always update pagination, even when totalItemsCount is 0
      const calculatedTotalPages = Math.max(1, Math.ceil(totalItemsCount / itemsPerPage));
      setPagination(currentPage, calculatedTotalPages, itemsPerPage);

      // Get data from Axios response
      const result = response.data;
      let tableData = processApiResponse(result);

      if (!isMountedRef.current) {
        // Component unmounted, but we'll still process the response
        // to cache it for when the user returns to this page
        console.log(
          "Component unmounted but continuing to process response for caching"
        );
      } else if (requestCounter !== currentRequestId) {
        // A newer request has been made, ignore this response
        return;
      }

      if (!totalCount && tableData.length > 0) {
        // Always process the response, even if the component is unmounted
        setTotalItems(tableData.length);
        const calculatedTotalPages = Math.ceil(tableData.length / itemsPerPage);
        setPagination(currentPage, calculatedTotalPages, itemsPerPage);
      } else if (!totalCount && tableData.length === 0) {
        // Always process the response, even if the component is unmounted
        // Update pagination to show 0 items with 1 empty page instead of showing an error
        setTotalItems(0);
        setPagination(1, 1, itemsPerPage);
      }

      if (dataMapper) {
        tableData = dataMapper(tableData);
      }

      // Always process the response, even if the component is unmounted
      if (configColumns && configColumns.length > 0) {
        setColumns(configColumns);
      } else if (tableData.length > 0) {
        const sampleRow = tableData[0];
        const extractedColumns = extractColumnsFromData(sampleRow);
        setColumns(extractedColumns);
      }

      setData(tableData);
      setLoading(false);
    } catch (err: any) {
      // Don't handle AbortError as an actual error
      if (!(err instanceof Error && err.name === "AbortError")) {
        console.log("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setData([]);
        setLoading(false);
      } else {
        console.log(
          "Request was aborted, likely due to component unmount or new request"
        );
      }
    }
  };

  return { fetchData };
};
