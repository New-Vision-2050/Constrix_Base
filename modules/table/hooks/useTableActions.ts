
import { useCallback } from 'react';

type TableActionProps = {
  setSort: (column: string | null, direction: 'asc' | 'desc' | null) => void;
  setSearch: (query: string, fields?: string[]) => void;
  setColumnSearch: (columnKey: string, value: string | string[]) => void;
  setPagination: (currentPage: number, totalPages: number, itemsPerPage: number) => void;
  totalPages: number;
  itemsPerPage: number;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  totalItems: number;
};

export const useTableActions = ({
  setSort,
  setSearch,
  setColumnSearch,
  setPagination,
  totalPages,
  itemsPerPage,
  sortColumn,
  sortDirection,
  totalItems
}: TableActionProps) => {
  
  // Handle sorting
  const handleSort = useCallback((column: string) => {
    setSort(
      column === sortColumn
        ? (sortDirection === 'asc' ? column : sortDirection === 'desc' ? null : column)
        : column,
      column === sortColumn
        ? (sortDirection === 'asc' ? 'desc' : sortDirection === 'desc' ? null : 'asc')
        : 'asc'
    );
  }, [sortColumn, sortDirection, setSort]);
  
  // Handle search
  const handleSearch = useCallback((query: string, fields?: string[]) => {
    setSearch(query, fields);
  }, [setSearch]);
  
  // Handle column-specific search
  const handleColumnSearch = useCallback((columnKey: string, value: string | string[]) => {
    console.log(`handleColumnSearch called for ${columnKey} with value:`, value);
    
    // Apply the column search
    setColumnSearch(columnKey, value);
    
    // Log after setting the column search
    console.log(`Column search state updated for ${columnKey}`);
  }, [setColumnSearch]);
  
  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setPagination(page, totalPages, itemsPerPage);
  }, [totalPages, itemsPerPage, setPagination]);
  
  // Handle items per page change
  const handleItemsPerPageChange = useCallback((items: number) => {
    setPagination(1, Math.ceil(totalItems / items), items);
  }, [totalItems, setPagination]);
  
  return {
    handleSort,
    handleSearch,
    handleColumnSearch,
    handlePageChange,
    handleItemsPerPageChange
  };
};
