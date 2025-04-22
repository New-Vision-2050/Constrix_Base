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
  
  // Column visibility state
  columnVisibility: {
    visible: boolean;
    keys: string[];
  };
  
  // Row selection state
  selectedRows: Record<string | number, boolean>;
  selectionEnabled: boolean;
  
  // Internal state for reload functionality
  _forceRefetch?: number; // Timestamp to force a refetch
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
  reloadTable: (tableId: string) => void; // New method to reload table data
  
  // Column visibility actions
  setColumnVisibility: (tableId: string, visible: boolean) => void;
  setColumnVisibilityKeys: (tableId: string, keys: string[]) => void;
  
  // Row selection actions
  setSelectionEnabled: (tableId: string, enabled: boolean) => void;
  selectRow: (tableId: string, rowId: string | number, selected: boolean) => void;
  selectAllRows: (tableId: string, selected: boolean) => void;
  clearSelectedRows: (tableId: string) => void;
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
  columnVisibility: {
    visible: true,
    keys: []
  },
  selectedRows: {},
  selectionEnabled: true // Set to true by default
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
  
  setVisibleColumns: (tableId: string, visibleColumnKeys: string[]) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          visibleColumnKeys,
          columnVisibility: {
            ...tableState.columnVisibility,
            keys: visibleColumnKeys
          }
        }
      }
    };
  }),
  
  toggleColumnVisibility: (tableId: string, columnKey: string) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    const visibleColumnKeys = tableState.visibleColumnKeys;
    
    const newVisibleColumnKeys = visibleColumnKeys.includes(columnKey)
      ? visibleColumnKeys.filter((key: string) => key !== columnKey)
      : [...visibleColumnKeys, columnKey];
    
    // Also update the columnVisibility keys
    const currentKeys = tableState.columnVisibility.keys.length > 0
      ? tableState.columnVisibility.keys
      : visibleColumnKeys;
    
    const newKeys = currentKeys.includes(columnKey)
      ? currentKeys.filter((key: string) => key !== columnKey)
      : [...currentKeys, columnKey];
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          visibleColumnKeys: newVisibleColumnKeys,
          columnVisibility: {
            ...tableState.columnVisibility,
            keys: newKeys
          }
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
  })),
  
  // Column visibility actions
  setColumnVisibility: (tableId: string, visible: boolean) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          columnVisibility: {
            ...tableState.columnVisibility,
            visible
          }
        }
      }
    };
  }),
  setColumnVisibilityKeys: (tableId: string, keys: string[]) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          columnVisibility: {
            ...tableState.columnVisibility,
            keys
          }
        }
      }
    };
  }),
  
  // Reload table data by forcing a refetch
  reloadTable: (tableId: string) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    if (!tableState) return state;
    
    // Generate a unique timestamp to force a refetch
    const timestamp = Date.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[TableStore] Reloading table ${tableId} with timestamp ${timestamp}`);
    }
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          loading: true,
          // Set the _forceRefetch property to the current timestamp
          _forceRefetch: timestamp
        }
      }
    };
  }),
  
  // Row selection actions
  setSelectionEnabled: (tableId: string, enabled: boolean) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          selectionEnabled: enabled,
          // Clear selected rows when disabling selection
          selectedRows: enabled ? tableState.selectedRows : {}
        }
      }
    };
  }),
  
  selectRow: (tableId: string, rowId: string | number, selected: boolean) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          selectedRows: {
            ...tableState.selectedRows,
            [rowId]: selected
          }
        }
      }
    };
  }),
  
  selectAllRows: (tableId: string, selected: boolean) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    const selectedRows: Record<string | number, boolean> = {};
    
    // If selected is true, select all rows, otherwise clear selection
    if (selected) {
      tableState.data.forEach((row, index) => {
        // Use row.id if available, otherwise use index
        const rowId = row.id !== undefined ? row.id : index;
        selectedRows[rowId] = true;
      });
    }
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          selectedRows
        }
      }
    };
  }),
  
  clearSelectedRows: (tableId: string) => set((state: TableState) => {
    const tableState = state.tables[tableId] || getDefaultTableState();
    
    return {
      tables: {
        ...state.tables,
        [tableId]: {
          ...tableState,
          selectedRows: {}
        }
      }
    };
  })
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
    
  const setColumnVisibility = useCallback((visible: boolean) =>
    useTableStore.getState().setColumnVisibility(tableId, visible), [tableId]);
    
  const setColumnVisibilityKeys = useCallback((keys: string[]) =>
    useTableStore.getState().setColumnVisibilityKeys(tableId, keys), [tableId]);
    
  const reloadTable = useCallback(() => {
    // Get the table store
    const tableStore = useTableStore.getState();
    
    // Call the reloadTable method
    tableStore.reloadTable(tableId);
    
    // After a short delay, set loading back to false
    setTimeout(() => {
      tableStore.setLoading(tableId, false);
    }, 200); // Increased timeout to ensure fetch completes
  }, [tableId]);
  
  // Row selection actions
  const setSelectionEnabled = useCallback((enabled: boolean) =>
    useTableStore.getState().setSelectionEnabled(tableId, enabled), [tableId]);
    
  const selectRow = useCallback((rowId: string | number, selected: boolean) =>
    useTableStore.getState().selectRow(tableId, rowId, selected), [tableId]);
    
  const selectAllRows = useCallback((selected: boolean) =>
    useTableStore.getState().selectAllRows(tableId, selected), [tableId]);
    
  const clearSelectedRows = useCallback(() =>
    useTableStore.getState().clearSelectedRows(tableId), [tableId]);
  
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
    resetTable,
    setColumnVisibility,
    setColumnVisibilityKeys,
    reloadTable, // Expose the reloadTable method
    
    // Row selection actions
    setSelectionEnabled,
    selectRow,
    selectAllRows,
    clearSelectedRows
  };
};

