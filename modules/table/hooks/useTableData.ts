import { useTableStore } from "@/modules/table/store//useTableStore";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import { SearchConfig } from "@/modules/table/utils/tableTypes";
import { createTableFetcher } from "./useTableFetcher";
import { useTableActions } from "./useTableActions";
import { useTableInitialization } from "./useTableInitialization";
import { useTableFetchEffect } from "./useTableFetchEffect";

export const useTableData = (
  url: string,
  configColumns?: ColumnConfig[],
  defaultItemsPerPage = 10,
  defaultSortColumn: string | null = null,
  defaultSortDirection: "asc" | "desc" | null = null,
  defaultSearchQuery = "",
  dataMapper?: (data: any) => any[],
  searchConfig?: SearchConfig
) => {
  // Get state and actions from the store
  const {
    data,
    columns,
    loading,
    isFirstLoad,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    sortColumn,
    sortDirection,
    searchQuery,
    searchFields,
    columnSearchState,

    setData,
    setColumns,
    setLoading,
    setIsFirstLoad,
    setError,
    setTotalItems,
    setPagination,
    setSort,
    setSearch,
    setColumnSearch,
    resetTable,
  } = useTableStore();

  // Initialize table state
  useTableInitialization({
    configColumns,
    defaultItemsPerPage,
    defaultSortColumn,
    defaultSortDirection,
    defaultSearchQuery,
    searchConfig,
    setPagination,
    setSort,
    setSearch,
    setColumns,
  });

  // Get data fetcher
  const { fetchData } = createTableFetcher();

  // Setup data fetching with dependencies
  useTableFetchEffect({
    url,
    currentPage,
    itemsPerPage,
    sortColumn,
    sortDirection,
    searchQuery,
    searchFields,
    columnSearchState,
    searchConfig,
    fetchData: (params) =>
      fetchData({
        ...params,
        setLoading,
        setError,
        setTotalItems,
        setPagination,
        setColumns,
        setData,
        dataMapper,
      }),
    setData,
    setColumns,
    setError,
    setIsFirstLoad,
    configColumns,
  });

  // Get table action handlers
  const {
    handleSort,
    handleSearch,
    handleColumnSearch,
    handlePageChange,
    handleItemsPerPageChange,
  } = useTableActions({
    setSort,
    setSearch,
    setColumnSearch,
    setPagination,
    totalPages,
    itemsPerPage,
    sortColumn,
    sortDirection,
    totalItems,
  });

  // Get visible columns state and actions
  const visibleColumnKeys = useTableStore((state) => state.visibleColumnKeys);
  const setVisibleColumns = useTableStore((state) => state.setVisibleColumns);
  const toggleColumnVisibility = useTableStore((state) => state.toggleColumnVisibility);

  // Handler for setting all columns visible
  const handleSetAllColumnsVisible = () => {
    setVisibleColumns(columns.map(col => col.key));
  };

  // Handler for setting minimal columns visible (just the first few columns)
  const handleSetMinimalColumnsVisible = () => {
    // Show only the first 2-3 columns as minimal view
    const minimalColumns = columns.slice(0, Math.min(3, columns.length)).map(col => col.key);
    setVisibleColumns(minimalColumns);
  };

  return {
    // State
    data,
    columns,
    visibleColumnKeys,
    loading,
    isFirstLoad,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    sortState: { column: sortColumn, direction: sortDirection },
    searchQuery,
    searchFields,
    columnSearchState,

    // Actions
    handleSort,
    handleSearch,
    handleColumnSearch,
    handlePageChange,
    handleItemsPerPageChange,
    toggleColumnVisibility,
    handleSetAllColumnsVisible,
    handleSetMinimalColumnsVisible,
    resetTable,
    setColumns, // Export setColumns so it can be used directly
  };
};
