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
import { useTableData } from "@/modules/table/hooks/useTableData";
import { useResetTableOnRouteChange } from "@/modules/table/hooks/useResetTableOnRouteChange";

interface TableBuilderProps {
  url?: string;
  config?: TableConfig;
  onReset?: () => void;
  searchBarActions?: React.ReactNode; // New prop for custom actions in search bar
  tableId?: string; // Unique ID for this table instance
}

const TableBuilder: React.FC<TableBuilderProps> = ({
  url,
  config,
  onReset,
  searchBarActions,
  tableId = `table-${Math.random().toString(36).substring(2, 9)}`, // Generate a random ID if not provided
}) => {
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
  } = useTableData(
    dataUrl,
    config?.columns,
    config?.defaultItemsPerPage || 10,
    config?.defaultSortColumn || null,
    config?.defaultSortDirection || null,
    config?.defaultSearchQuery || "",
    config?.dataMapper,
    searchConfig,
    tableId // Pass the tableId to isolate this table's state
  );

  // Initialize columns from config immediately if available
  // Use a ref to track if we've already set the columns
  const columnsInitializedRef = React.useRef(false);

  useEffect(() => {
    if (!columnsInitializedRef.current && config?.columns && config.columns.length > 0) {
      setColumns(config.columns);
      columnsInitializedRef.current = true;
    }
  }, [config?.columns]); // Remove setColumns from dependencies

  const enableSorting = config?.enableSorting !== false;
  const enablePagination = config?.enablePagination !== false;
  const enableSearch = config?.enableSearch !== false;
  const enableColumnSearch = config?.enableColumnSearch === true;
  const searchableColumns = columns.filter((col: ColumnConfig) => col.searchable);
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
        className="space-y-4 w-full bg-sidebar rounded-lg "
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
            actions={searchBarActions} // Pass custom actions to SearchBar
          />
        )}

        <DataTable
          data={data}
          // Use columnVisibility to control which columns are displayed
          columns={
            // Never return an empty array of columns
            // If columnVisibility.visible is false, still show the columns but respect the keys
            (columnVisibility?.keys?.length > 0 || visibleColumnKeys.length > 0)
              ? (config?.columns || columns).filter((col: ColumnConfig) => {
                  // If columnVisibility.visible is false, don't filter by keys
                  if (columnVisibility?.visible === false) {
                    return true;
                  }
                  
                  const keysToUse = columnVisibility?.keys?.length > 0
                    ? columnVisibility.keys
                    : visibleColumnKeys;
                  return keysToUse.includes(col.key);
                })
              : (config?.columns || columns)
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
