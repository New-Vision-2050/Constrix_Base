
import { create } from 'zustand';
import { ColumnConfig } from '@/modules/table/utils/tableConfig';
import { TableData, SortDirection, ColumnSearchState } from '@/modules/table/utils/tableTypes';

interface TableState {
  // Data state
  data: TableData[];
  columns: ColumnConfig[];
  visibleColumnKeys: string[]; // New state for visible columns
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
  
  // Action methods
  setData: (data: TableData[]) => void;
  setColumns: (columns: ColumnConfig[]) => void;
  setVisibleColumns: (columnKeys: string[]) => void; // New action for setting visible columns
  toggleColumnVisibility: (columnKey: string) => void; // New action for toggling a column's visibility
  setLoading: (loading: boolean) => void;
  setIsFirstLoad: (isFirstLoad: boolean) => void;
  setError: (error: string | null) => void;
  setTotalItems: (totalItems: number) => void;
  setPagination: (currentPage: number, totalPages: number, itemsPerPage: number) => void;
  setSort: (column: string | null, direction: SortDirection) => void;
  setSearch: (query: string, fields?: string[]) => void;
  setColumnSearch: (columnKey: string, value: string | string[]) => void;
  resetTable: () => void;
}

export const useTableStore = create<TableState>((set) => ({
  // Initial state
  data: [],
  columns: [],
  visibleColumnKeys: [], // Initialize empty array for visible columns
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
  
  // Action methods
  setData: (data) => set({ data }),
  
  setColumns: (columns) => set((state) => {
    // When columns are set, also update visible columns to include all by default
    const columnKeys = columns.map(col => col.key);
    return {
      columns,
      // Only set visibleColumnKeys if it's empty or columns have changed
      visibleColumnKeys: state.visibleColumnKeys.length === 0 ? columnKeys : state.visibleColumnKeys
    };
  }),
  
  // New method to set visible columns
  setVisibleColumns: (visibleColumnKeys) => set({ visibleColumnKeys }),
  
  // New method to toggle a column's visibility
  toggleColumnVisibility: (columnKey) => set((state) => {
    if (state.visibleColumnKeys.includes(columnKey)) {
      // Remove column from visible columns
      return {
        visibleColumnKeys: state.visibleColumnKeys.filter(key => key !== columnKey)
      };
    } else {
      // Add column to visible columns
      return {
        visibleColumnKeys: [...state.visibleColumnKeys, columnKey]
      };
    }
  }),
  
  setLoading: (loading) => set((state) => ({
    loading,
    isFirstLoad: loading ? state.isFirstLoad : false
  })),
  setIsFirstLoad: (isFirstLoad) => set({ isFirstLoad }),
  setError: (error) => set({ error }),
  setTotalItems: (totalItems) => set({ totalItems }),
  
  setPagination: (currentPage, totalPages, itemsPerPage) => set({
    currentPage,
    totalPages,
    itemsPerPage
  }),
  
  setSort: (sortColumn, sortDirection) => set({
    sortColumn,
    sortDirection,
    currentPage: 1 // Reset to first page when sorting changes
  }),
  
  setSearch: (searchQuery, searchFields) => set({
    searchQuery,
    searchFields: searchFields ? searchFields : undefined,
    currentPage: 1 // Reset to first page when search changes
  }),
  
  setColumnSearch: (columnKey, value) => set((state) => ({
    columnSearchState: {
      ...state.columnSearchState,
      [columnKey]: value
    },
    currentPage: 1 // Reset to first page when column search changes
  })),
  
  resetTable: () => set({
    data: [],
    columns: [],
    visibleColumnKeys: [], // Reset visible columns
    loading: false,
    isFirstLoad: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    sortColumn: null,
    sortDirection: null,
    searchQuery: '',
    searchFields: undefined,
    columnSearchState: {}
  })
}));
