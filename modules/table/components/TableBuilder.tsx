
import React, { useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { TableConfig } from '@/modules/table/utils/configs/tableConfig';
import { Button } from "@/modules/table/components/ui/button";
import ErrorMessage from './ErrorMessage';
import { useToast } from "@/modules/table/hooks/use-toast";
import SearchBar from './table/SearchBar';
import ColumnSearch from './table/ColumnSearch';
import DataTable from './table/DataTable';
import { useTableData } from '@/modules/table/hooks/useTableData';

interface TableBuilderProps {
  url?: string;
  config?: TableConfig;
  onReset?: () => void;
  searchBarActions?: React.ReactNode; // New prop for custom actions in search bar
}

const TableBuilder: React.FC<TableBuilderProps> = ({
  url,
  config,
  onReset,
  searchBarActions
}) => {
  const { toast } = useToast();
  // Use URL from config if direct URL not provided
  const dataUrl = url || (config ? config.url : '');

  if (!dataUrl) {
    return <ErrorMessage message="No URL or configuration provided" onRetry={onReset} />;
  }

  // Extract search configuration from the config
  const searchConfig = {
    defaultFields: config?.searchFields,
    paramName: config?.searchParamName || 'q',
    fieldParamName: config?.searchFieldParamName,
    allowFieldSelection: config?.allowSearchFieldSelection
  };

  const {
    data,
    columns,
    loading,
    error,
    isFirstLoad,
    sortState,
    searchQuery,
    searchFields,
    columnSearchState,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    handleSort,
    handleSearch,
    handleColumnSearch,
    handlePageChange,
    handleItemsPerPageChange,
    setColumns
  } = useTableData(
    dataUrl,
    config?.columns,
    config?.defaultItemsPerPage || 10,
    config?.defaultSortColumn || null,
    config?.defaultSortDirection || null,
    config?.defaultSearchQuery || '',
    config?.dataMapper,
    searchConfig
  );

  // Initialize columns from config immediately if available
  useEffect(() => {
    if (config?.columns && config.columns.length > 0) {
      setColumns(config.columns);
    }
  }, [config?.columns, setColumns]);

  const enableSorting = config?.enableSorting !== false;
  const enablePagination = config?.enablePagination !== false;
  const enableSearch = config?.enableSearch !== false;
  const enableColumnSearch = config?.enableColumnSearch === true;
  const searchableColumns = columns.filter(col => col.searchable);
  const hasSearchableColumns = searchableColumns.length > 0;

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

  if (error) {
    return <ErrorMessage message={error} onRetry={onReset} />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="space-y-4 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {enableSearch && hasSearchableColumns && (
          <SearchBar
            searchQuery={searchQuery}
            onSearch={handleSearch}
            searchConfig={searchConfig}
            searchableColumns={searchableColumns}
            actions={searchBarActions} // Pass custom actions to SearchBar
          />
        )}

        {enableColumnSearch && hasSearchableColumns && (
          <ColumnSearch
            columns={columns}
            columnSearchState={columnSearchState}
            onColumnSearch={handleColumnSearch}
          />
        )}

        <DataTable
          data={data}
          columns={config?.columns || columns}
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
            <Button
              variant="outline"
              onClick={onReset}
              className="text-sm"
            >
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
