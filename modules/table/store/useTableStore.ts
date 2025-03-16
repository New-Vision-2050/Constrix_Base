
import { create } from 'zustand';
import { ColumnConfig } from '@/modules/table/utils/tableConfig';
import { TableData, SortDirection, ColumnSearchState } from '@/modules/table/utils/tableTypes';

interface TableState {
  // Data state
  data: TableData[];
  columns: ColumnConfig[];
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
  setLoading: (loading: boolean) => void;
  setIsFirstLoad: (isFirstLoad: boolean) => void;
  setError: (error: string | null) => void;
  setTotalItems: (totalItems: number) => void;
  setPagination: (currentPage: number, totalPages: number, itemsPerPage: number) => void;
  setSort: (column: string | null, direction: SortDirection) => void;
  setSearch: (query: string, fields?: string[]) => void;
  setColumnSearch: (columnKey: string, value: string) => void;
  resetTable: () => void;
}

export const useTableStore = create<TableState>((set) => ({
  // Initial state
  data: [],
  columns: [],
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
  setColumns: (columns) => set({ columns }),
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
