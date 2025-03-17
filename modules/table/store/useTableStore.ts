import { create } from 'zustand';
import { ColumnConfig } from '@/modules/table/utils/tableConfig';
import { TableData, SortDirection, ColumnSearchState } from '@/modules/table/utils/tableTypes';
import { useEffect, useMemo, useCallback, useRef } from 'react';

// Define the state for a single table instance
interface TableInstanceState {
  // Data state
  data: TableData[];
  columns: ColumnConfig[];
  visibleColumnKeys: string[];
  totalItems: number;
  
  // Loading and error states
  loading: boolean;
  isFirstLoad: boolean;
  error: string | null;
  
  // Pagination state
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  
  // Sorting state
  sortColumn: string | null;
  sortDirection: SortDirection;
  
  // Search state
  searchQuery: string;
  searchFields: string[] | undefined;
  
  // Column-specific search state
  columnSearchState: ColumnSearchState;
}

// Define the global store that holds multiple table instances
interface TableState {
  // Map of table instances by tableId
  tables: Record<string, TableInstanceState>;
  
  // Current active table ID
  activeTableId: string;
  
  // Action methods
  setTableId: (tableId: string) => void;
  initTable: (tableId: string) => void;
  setData: (tableId: string, data: TableData[]) => void;
  setColumns: (tableId: string, columns: ColumnConfig[]) => void;
  setVisibleColumns: (tableId: string, columnKeys: string[]) => void;
  toggleColumnVisibility: (tableId: string, columnKey: string) => void;
  setLoading: (tableId: string, loading: boolean) => void;
  setIsFirstLoad: (tableId: string, isFirstLoad: boolean) => void;
  setError: (tableId: string, error: string | null) => void;
  setTotalItems: (tableId: string, totalItems: number) => void;
  setPagination: (tableId: string, currentPage: number, totalPages: number, itemsPerPage: number) => void;
  setSort: (tableId: string, column: string | null, direction: SortDirection) => void;
  setSearch: (tableId: string, query: string, fields?: string[]) => void;
  setColumnSearch: (tableId: string, columnKey: string, value: string | string[]) => void;
  resetTable: (tableId: string) => void;
}

// Default state for a new table instance
const getDefaultTableState = (): TableInstanceState => ({
  data: [],
  columns: [],
  visibleColumnKeys: [],
  loading: false,
  isFirstLoad: true,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 10,
  totalItems: 0,
  sortColumn: null,
  sortDirection: null,
  searchQuery: '',
  searchFields: undefined,
  columnSearchState: {},
});

// Create the store with proper server snapshot caching
// Create the store with proper server snapshot caching
export const useTableStore = create<TableState>((set) => ({
  // Initial state
  tables: {},
  activeTableId: 'default',
  
  // Set the active table ID
  setTableId: (tableId: string) => set({ activeTableId: tableId }),
  
  // Initialize a new table instance if it doesn't exist
  initTable: (tableId: string) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: state.tables[tableId] || getDefaultTableState()
    }
  })),
  
  // Action methods for specific table instances
  setData: (tableId: string, data: TableData[]) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId] || getDefaultTableState(),
        data
      }
    }
  })),
  
  setColumns: (tableId: string, columns: ColumnConfig[]) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    const columnKeys = columns.map((col: ColumnConfig) => col.key);
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          columns,
          // Only set visibleColumnKeys if it's empty or columns have changed
          visibleColumnKeys: tableState.visibleColumnKeys.length === 0 ? columnKeys : tableState.visibleColumnKeys
        }
      }
    };
  }),
  
  setVisibleColumns: (tableId: string, visibleColumnKeys: string[]) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId] || getDefaultTableState(),
        visibleColumnKeys
      }
    }
  })),
  
  toggleColumnVisibility: (tableId: string, columnKey: string) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    const visibleColumnKeys = tableState.visibleColumnKeys;
    
    const newVisibleColumnKeys = visibleColumnKeys.includes(columnKey)
      ? visibleColumnKeys.filter((key: string) => key !== columnKey)
      : [...visibleColumnKeys, columnKey];
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          visibleColumnKeys: newVisibleColumnKeys
        }
      }
    };
  }),
  
  setLoading: (tableId: string, loading: boolean) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          loading,
          isFirstLoad: loading ? tableState.isFirstLoad : false
        }
      }
    };
  }),
  
  setIsFirstLoad: (tableId: string, isFirstLoad: boolean) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId] || getDefaultTableState(),
        isFirstLoad
      }
    }
  })),
  
  setError: (tableId: string, error: string | null) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId] || getDefaultTableState(),
        error
      }
    }
  })),
  
  setTotalItems: (tableId: string, totalItems: number) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId] || getDefaultTableState(),
        totalItems
      }
    }
  })),
  
  setPagination: (tableId: string, currentPage: number, totalPages: number, itemsPerPage: number) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId] || getDefaultTableState(),
        currentPage,
        totalPages,
        itemsPerPage
      }
    }
  })),
  
  setSort: (tableId: string, sortColumn: string | null, sortDirection: SortDirection) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId] || getDefaultTableState(),
        sortColumn,
        sortDirection,
        currentPage: 1 // Reset to first page when sorting changes
      }
    }
  })),
  
  setSearch: (tableId: string, searchQuery: string, searchFields?: string[]) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: {
        ...state.tables[tableId] || getDefaultTableState(),
        searchQuery,
        searchFields: searchFields ? searchFields : undefined,
        currentPage: 1 // Reset to first page when search changes
      }
    }
  })),
  
  setColumnSearch: (tableId: string, columnKey: string, value: string | string[]) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    
    console.log(`setColumnSearch in store for ${tableId}.${columnKey}:`, value);
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          columnSearchState: {
            ...tableState.columnSearchState,
            [columnKey]: value
          },
          currentPage: 1 // Reset to first page when column search changes
        }
      }
    };
  }),
  
  resetTable: (tableId: string) => set((state: TableState) => ({
    tables: {
      ...state.tables,
      [tableId]: getDefaultTableState()
    }
  }))
}));

// Helper functions to access the current table state
export const useTableInstance = (tableId: string) => {
  // Initialize the table in a useEffect hook to avoid the "Cannot update a component while rendering a different component" error
  useEffect(() => {
    // Only initialize the table once on the client side
    if (typeof window !== 'undefined') {
      useTableStore.getState().initTable(tableId);
    }
  }, [tableId]);
  
  // Create a stable reference for the default state
  const defaultStateRef = useRef(getDefaultTableState());
  
  // Use a memoized selector to prevent infinite loops
  const selector = useCallback(
    (state: TableState) => state.tables[tableId] || defaultStateRef.current,
    [tableId]
  );
  
  // Get the table state using the memoized selector
  const tableState = useTableStore(selector);
  
  // Get the actions for this table with memoization to prevent unnecessary re-renders
  const setData = useCallback((data: TableData[]) =>
    useTableStore.getState().setData(tableId, data), [tableId]);
    
  const setColumns = useCallback((columns: ColumnConfig[]) =>
    useTableStore.getState().setColumns(tableId, columns), [tableId]);
    
  const setVisibleColumns = useCallback((columnKeys: string[]) =>
    useTableStore.getState().setVisibleColumns(tableId, columnKeys), [tableId]);
    
  const toggleColumnVisibility = useCallback((columnKey: string) =>
    useTableStore.getState().toggleColumnVisibility(tableId, columnKey), [tableId]);
    
  const setLoading = useCallback((loading: boolean) =>
    useTableStore.getState().setLoading(tableId, loading), [tableId]);
    
  const setIsFirstLoad = useCallback((isFirstLoad: boolean) =>
    useTableStore.getState().setIsFirstLoad(tableId, isFirstLoad), [tableId]);
    
  const setError = useCallback((error: string | null) =>
    useTableStore.getState().setError(tableId, error), [tableId]);
    
  const setTotalItems = useCallback((totalItems: number) =>
    useTableStore.getState().setTotalItems(tableId, totalItems), [tableId]);
    
  const setPagination = useCallback((currentPage: number, totalPages: number, itemsPerPage: number) =>
    useTableStore.getState().setPagination(tableId, currentPage, totalPages, itemsPerPage), [tableId]);
    
  const setSort = useCallback((column: string | null, direction: SortDirection) =>
    useTableStore.getState().setSort(tableId, column, direction), [tableId]);
    
  const setSearch = useCallback((query: string, fields?: string[]) =>
    useTableStore.getState().setSearch(tableId, query, fields), [tableId]);
    
  const setColumnSearch = useCallback((columnKey: string, value: string | string[]) =>
    useTableStore.getState().setColumnSearch(tableId, columnKey, value), [tableId]);
    
  const resetTable = useCallback(() =>
    useTableStore.getState().resetTable(tableId), [tableId]);
  
  return {
    // State
    ...tableState,
    
    // Actions
    setData,
    setColumns,
    setVisibleColumns,
    toggleColumnVisibility,
    setLoading,
    setIsFirstLoad,
    setError,
    setTotalItems,
    setPagination,
    setSort,
    setSearch,
    setColumnSearch,
    resetTable
  };
};

