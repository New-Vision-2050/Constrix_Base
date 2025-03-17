import { useTableInstance, useTableStore } from "@/modules/table/store/useTableStore";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import { SearchConfig } from "@/modules/table/utils/tableTypes";
import { createTableFetcher } from "./useTableFetcher";
import { useTableActions } from "./useTableActions";
import { useTableInitialization } from "./useTableInitialization";
import { useTableFetchEffect } from "./useTableFetchEffect";
import { useEffect } from "react";

export const useTableData = (
  url: string,
  configColumns?: ColumnConfig[],
  defaultItemsPerPage = 10,
  defaultSortColumn: string | null = null,
  defaultSortDirection: "asc" | "desc" | null = null,
  defaultSearchQuery = "",
  dataMapper?: (data: any) => any[],
  searchConfig?: SearchConfig,
  tableId: string = 'default' // Default table ID if not provided
) => {
  // Set the active table ID
  const setTableId = useTableStore((state) => state.setTableId);
  
  // Set the active table ID only once
  useEffect(() => {
    setTableId(tableId);
    
    // Return cleanup function
    return () => {
      // Don't reset the table on unmount to allow for data persistence
      // This is important for maintaining table state across route changes
    };
  }, [tableId]); // Remove setTableId from dependencies to prevent unnecessary re-renders
  
  // Get state and actions from the table instance
  const tableInstance = useTableInstance(tableId);
  
  const {
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
    sortColumn,
    sortDirection,
    searchQuery,
    searchFields,
    columnSearchState,
    columnVisibility,

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
    setVisibleColumns,
    toggleColumnVisibility,
    setColumnVisibility,
    setColumnVisibilityKeys,
  } = tableInstance;

  // Initialize table state
  useTableInitialization({
    configColumns,
    defaultItemsPerPage,
    defaultSortColumn,
    defaultSortDirection,
    defaultSearchQuery,
    searchConfig,
    setPagination: (currentPage, totalPages, itemsPerPage) =>
      setPagination(currentPage, totalPages, itemsPerPage),
    setSort: (column, direction) => setSort(column, direction),
    setSearch: (query, fields) => setSearch(query, fields),
    setColumns: (columns) => setColumns(columns),
    setVisibleColumns: (columnKeys) => setVisibleColumns(columnKeys),
  });

  // Get data fetcher
  const { fetchData } = createTableFetcher();

  // We removed the manual reload effect for columnSearchState changes
  // as it was causing an infinite loop

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
        setLoading: (loading) => setLoading(loading),
        setError: (error) => setError(error),
        setTotalItems: (totalItems) => setTotalItems(totalItems),
        setPagination: (currentPage, totalPages, itemsPerPage) =>
          setPagination(currentPage, totalPages, itemsPerPage),
        setColumns: (columns) => setColumns(columns),
        setData: (data) => setData(data),
        dataMapper,
      }),
    setData: (data) => setData(data),
    setColumns: (columns) => setColumns(columns),
    setError: (error) => setError(error),
    setIsFirstLoad: (isFirstLoad) => setIsFirstLoad(isFirstLoad),
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
    setSort: (column, direction) => setSort(column, direction),
    setSearch: (query, fields) => setSearch(query, fields),
    setColumnSearch: (columnKey, value) => setColumnSearch(columnKey, value),
    setPagination: (currentPage, totalPages, itemsPerPage) =>
      setPagination(currentPage, totalPages, itemsPerPage),
    totalPages,
    itemsPerPage,
    sortColumn,
    sortDirection,
    totalItems,
  });

  // Handler for setting all columns visible
  const handleSetAllColumnsVisible = () => {
    const allColumnKeys = columns.map((col: ColumnConfig) => col.key);
    // Update both the old and new APIs
    setVisibleColumns(allColumnKeys);
    
    // Also update the columnVisibility state if it exists
    if (setColumnVisibility && setColumnVisibilityKeys) {
      setColumnVisibility(true);
      setColumnVisibilityKeys(allColumnKeys);
    }
  };

  // Handler for setting minimal columns visible (just the first few columns)
  const handleSetMinimalColumnsVisible = () => {
    // Show only the first 2-3 columns as minimal view
    const minimalColumns = columns.slice(0, Math.min(3, columns.length)).map((col: ColumnConfig) => col.key);
    
    // Update both the old and new APIs
    setVisibleColumns(minimalColumns);
    
    // Also update the columnVisibility state if it exists
    if (setColumnVisibility && setColumnVisibilityKeys) {
      setColumnVisibility(true);
      setColumnVisibilityKeys(minimalColumns);
    }
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
    columnVisibility,
    tableId,

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
    setColumnVisibility,
    setColumnVisibilityKeys,
  };
};
