import {
  SearchConfig,
  ColumnSearchState,
} from "@/modules/table/utils/tableTypes";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import {
  processApiResponse,
  extractColumnsFromData,
  extractPaginationMeta,
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

      // Get data from Axios response
      const result = response.data;

      let tableData = processApiResponse(result);

      const totalCountHeader = response.headers["x-total-count"];
      const { totalItems: totalItemsFromBody, totalPages: totalPagesFromBody } =
        extractPaginationMeta(result, itemsPerPage, tableData.length);

      const totalItemsCount = totalCountHeader
        ? parseInt(String(totalCountHeader), 10)
        : totalItemsFromBody;

      const totalPages = totalPagesFromBody;

      setTotalItems(totalItemsCount);
      setPagination(currentPage, totalPages, itemsPerPage);

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

      // Fallback: unpaginated array responses (no pagination metadata)
      const hasPaginationMeta =
        result?.pagination != null ||
        result?.last_page != null ||
        result?.result_count != null ||
        result?.total_count != null ||
        result?.total != null;

      if (!totalCountHeader && !hasPaginationMeta && tableData.length > 0) {
        setTotalItems(tableData.length);
        const calculatedTotalPages = Math.ceil(tableData.length / itemsPerPage);
        setPagination(currentPage, calculatedTotalPages, itemsPerPage);
      } else if (
        !totalCountHeader &&
        !hasPaginationMeta &&
        tableData.length === 0
      ) {
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
      // Don't handle AbortError or CanceledError as an actual error
      const isAbortError = err instanceof Error && err.name === "AbortError";
      const isCanceledError = err?.name === "CanceledError" || err?.code === "ERR_CANCELED" || err?.message === "canceled";
      
      if (!isAbortError && !isCanceledError) {
        console.log("Error fetching data:", err);
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setData([]);
        setLoading(false);
      } else {
        console.log(
          "Request was aborted or canceled, likely due to component unmount or new request"
        );
      }
    }
  };

  return { fetchData };
};
