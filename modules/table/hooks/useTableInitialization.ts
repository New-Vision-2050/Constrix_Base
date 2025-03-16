
import { useEffect, useRef } from 'react';
import { useTableStore } from '@/modules/table/store//useTableStore';
import { ColumnConfig } from '@/modules/table/utils/tableConfig';
import { SearchConfig } from '@/modules/table/utils/tableTypes';

interface TableInitializationProps {
  configColumns?: ColumnConfig[];
  defaultItemsPerPage: number;
  defaultSortColumn: string | null;
  defaultSortDirection: 'asc' | 'desc' | null;
  defaultSearchQuery: string;
  searchConfig?: SearchConfig;
  setPagination: (currentPage: number, totalPages: number, itemsPerPage: number) => void;
  setSort: (column: string | null, direction: 'asc' | 'desc' | null) => void;
  setSearch: (query: string, fields?: string[]) => void;
  setColumns: (columns: ColumnConfig[]) => void;
}

export const useTableInitialization = ({
  configColumns,
  defaultItemsPerPage,
  defaultSortColumn,
  defaultSortDirection,
  defaultSearchQuery,
  searchConfig,
  setPagination,
  setSort,
  setSearch,
  setColumns
}: TableInitializationProps) => {
  const isInitializedRef = useRef<boolean>(false);
  
  // Initialize state only once
  useEffect(() => {
    if (isInitializedRef.current) return;
    
    isInitializedRef.current = true;
    
    // Set initial pagination options
    setPagination(1, 1, defaultItemsPerPage);
    
    // Set initial sort state if provided
    if (defaultSortColumn && defaultSortDirection) {
      setSort(defaultSortColumn, defaultSortDirection);
    }
    
    // Set initial search query if provided
    if (defaultSearchQuery) {
      setSearch(defaultSearchQuery, searchConfig?.defaultFields);
    }
    
    // Set initial columns if provided
    if (configColumns && configColumns.length > 0) {
      setColumns(configColumns);
    }
  }, []);
  
  return { isInitialized: isInitializedRef.current };
};
