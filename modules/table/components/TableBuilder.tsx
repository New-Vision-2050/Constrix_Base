"use client";
import React, { memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TableConfig } from "@/modules/table/utils/configs/tableConfig";
import { ColumnConfig } from "@/modules/table/utils/tableConfig";
import { Button } from "@/modules/table/components/ui/button";
import ErrorMessage from "./ErrorMessage";
import { useToast } from "@/modules/table/hooks/use-toast";
import SearchBar from "./table/SearchBar";
import ColumnSearch from "./table/ColumnSearch";
import DataTable from "./table/DataTable";
import ExportButton from "./table/ExportButton";
import { useTableData } from "@/modules/table/hooks/useTableData";
import { useResetTableOnRouteChange } from "@/modules/table/hooks/useResetTableOnRouteChange";

interface TableBuilderProps {
  url?: string;
  config?: TableConfig;
  onReset?: () => void;
  searchBarActions?: React.ReactNode; // New prop for custom actions in search bar
  tableId?: string; // Optional table ID override
}

const TableBuilder: React.FC<TableBuilderProps> = ({
  url,
  config,
  onReset,
  searchBarActions,
  tableId: propTableId,
}) => {
  // Generate a random ID if not provided in config or props
  const tableId =
    propTableId ||
    config?.tableId ||
    `table-${Math.random().toString(36).substring(2, 9)}`;
  const { toast } = useToast();

  // Use the reset hook to clear table state on route changes
  // This prevents stale data when navigating between pages
  useResetTableOnRouteChange(tableId);

  // Use URL from config if direct URL not provided
  const dataUrl = url || (config ? config.url : "");

  if (!dataUrl) {
    return (
      <ErrorMessage
        message="No URL or configuration provided"
        onRetry={onReset}
      />
    );
  }

  // Extract search configuration from the config
  const searchConfig = {
    defaultFields: config?.searchFields,
    paramName: config?.searchParamName || "q",
    fieldParamName: config?.searchFieldParamName,
    allowFieldSelection: config?.allowSearchFieldSelection,
  };

  const {
    data,
    columns,
    visibleColumnKeys,
    loading,
    error,
    isFirstLoad,
    sortState,
    searchQuery,
    searchFields,
    columnSearchState,
    columnVisibility,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    selectedRows,
    selectionEnabled,
    handleSort,
    handleSearch,
    handleColumnSearch,
    handlePageChange,
    handleItemsPerPageChange,
    toggleColumnVisibility,
    handleSetAllColumnsVisible,
    handleSetMinimalColumnsVisible,
    setColumns,
    setColumnVisibility,
    setColumnVisibilityKeys,
    setSelectionEnabled,
    selectRow,
    selectAllRows,
    clearSelectedRows,
  } = useTableData(
    dataUrl,
    config?.columns,
    config?.defaultItemsPerPage || 10,
    config?.defaultSortColumn || null,
    config?.defaultSortDirection || null,
    config?.defaultSearchQuery || "",
    config?.dataMapper,
    searchConfig,
    config // Pass the entire config object
  );

  // Initialize columns from config immediately if available
  // Use a ref to track if we've already set the columns
  const columnsInitializedRef = React.useRef(false);

  // Store the columns in a ref to avoid dependency issues
  const configColumnsRef = React.useRef(config?.columns);

  // Store the tableId in a ref to avoid dependency issues
  const tableIdRef = React.useRef(tableId);

  useEffect(() => {
    // Only initialize once and only if we have columns
    if (
      !columnsInitializedRef.current &&
      config?.columns &&
      config.columns.length > 0
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `[TableBuilder] Initializing columns for table ${tableIdRef.current}`
        );
      }

      // Filter columns based on availableColumnKeys if provided
      let filteredColumns = [...config.columns];
      if (config.availableColumnKeys && config.availableColumnKeys.length > 0) {
        filteredColumns = filteredColumns.filter((col) =>
          config.availableColumnKeys?.includes(col.key)
        );
      }

      setColumns(filteredColumns);

      // Set default visible columns if provided
      if (
        config.defaultVisibleColumnKeys &&
        config.defaultVisibleColumnKeys.length > 0
      ) {
        setColumnVisibilityKeys(config.defaultVisibleColumnKeys);
      }

      columnsInitializedRef.current = true;
      configColumnsRef.current = filteredColumns;
    }
  }, []); // Empty dependency array to run only once on mount

  const enableSorting = config?.enableSorting !== false;
  const enablePagination = config?.enablePagination !== false;
  const enableSearch = config?.enableSearch !== false;
  const enableColumnSearch = config?.enableColumnSearch === true;
  // Only disable row selection if explicitly set to false
  const enableRowSelection = config?.enableRowSelection !== false;

  // Initialize row selection based on config or default
  React.useEffect(() => {
    // Set selection enabled state based on config
    setSelectionEnabled(enableRowSelection);
  }, [enableRowSelection, setSelectionEnabled]);
  const searchableColumns = columns;
  const hasSearchableColumns = searchableColumns.length > 0;
  const allSearchedFields = config?.allSearchedFields;

  // Show error toast when an error occurs
  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // if (error) {
  //   return <ErrorMessage message={error} onRetry={onReset} />;
  // }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="space-y-4 w-full bg-sidebar rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {enableColumnSearch && hasSearchableColumns && (
          <ColumnSearch
            columns={columns}
            columnSearchState={columnSearchState}
            onColumnSearch={handleColumnSearch}
            allSearchedFields={allSearchedFields}
          />
        )}

        {enableSearch && hasSearchableColumns && (
          <SearchBar
            tableTitle={config?.tableTitle}
            hideSearchField={config?.hideSearchField}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            searchConfig={searchConfig}
            searchableColumns={searchableColumns}
            columns={columns}
            visibleColumnKeys={visibleColumnKeys}
            onToggleColumnVisibility={toggleColumnVisibility}
            onSetAllColumnsVisible={handleSetAllColumnsVisible}
            onSetMinimalColumnsVisible={handleSetMinimalColumnsVisible}
            columnVisibility={columnVisibility}
            onSetColumnVisibility={setColumnVisibility}
            onSetColumnVisibilityKeys={setColumnVisibilityKeys}
            actions={
              <div className="flex items-center gap-2">
                {/* Add the ExportButton component */}
                <ExportButton
                  url={dataUrl}
                  selectedRows={selectedRows}
                  disabled={loading || !selectionEnabled || !data.length}
                  searchQuery={searchQuery}
                  searchFields={searchFields}
                  columnSearchState={columnSearchState}
                />
                {/* Include any custom actions passed from the parent */}
                {searchBarActions}
              </div>
            }
          />
        )}

        <DataTable
          data={data}
          // Use columnVisibility to control which columns are displayed
          columns={
            // Never return an empty array of columns
            // If columnVisibility.visible is false, still show the columns but respect the keys
            columnVisibility?.keys?.length > 0 || visibleColumnKeys.length > 0
              ? (config?.columns || columns).filter((col: ColumnConfig) => {
                  // If columnVisibility.visible is false, don't filter by keys
                  if (columnVisibility?.visible === false) {
                    return true;
                  }

                  const keysToUse =
                    columnVisibility?.keys?.length > 0
                      ? columnVisibility.keys
                      : visibleColumnKeys;
                  return keysToUse.includes(col.key);
                })
              : columns || config?.columns
          }
          searchQuery={searchQuery}
          sortState={sortState}
          onSort={handleSort}
          enableSorting={enableSorting}
          enablePagination={enablePagination}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          loading={loading}
          // Row selection props
          selectionEnabled={selectionEnabled}
          selectedRows={selectedRows}
          onSelectRow={selectRow}
          onSelectAllRows={selectAllRows}
        />

        {onReset && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={onReset} className="text-sm">
              Try Different URL
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

// Use React.memo to prevent unnecessary re-renders of the entire component
export default memo(TableBuilder);
