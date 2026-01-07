import { ColumnDef } from "../table-component/types";

// ============================================================================
// Table State Types
// ============================================================================

export type PaginationConfig = {
  page?: number; // Initial page (default: 1)
  limit?: number; // Items per page (default: 10)
  totalItems?: number; // Total number of items
};

export type TableStateOptions<TRow> = {
  // Data
  data: TRow[];
  columns: ColumnDef<TRow>[];

  // Pagination
  pagination?: PaginationConfig;

  // Selection
  getRowId?: (row: TRow) => string;

  // Sorting
  initialSortBy?: string;
  initialSortDirection?: "asc" | "desc";

  // Loading & Filtering
  loading?: boolean;
  filtered?: boolean;

  // Actions
  onExport?: (selectedRows: TRow[]) => void | Promise<void>;
  onDelete?: (selectedRows: TRow[]) => void | Promise<void>;
};

export type TableState<TRow> = {
  // Table-specific state
  table: {
    columns: ColumnDef<TRow>[];
    data: TRow[];
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    loading: boolean;
    filtered: boolean;
    handleSort: (key: string) => void;
  };

  // Pagination state
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    nextPage: () => void;
    prevPage: () => void;
    canNextPage: boolean;
    canPrevPage: boolean;
    paginatedData: TRow[];
  };

  // Selection state
  selection: {
    selectedRows: TRow[];
    setSelectedRows: (rows: TRow[]) => void;
    clearSelection: () => void;
    selectAll: () => void;
    hasSelection: boolean;
    selectedCount: number;
    isRowSelected: (row: TRow) => boolean;
    toggleRow: (row: TRow) => void;
    isRowFromOtherPage: (row: TRow) => boolean; // Check if row is sticky (from another page)
  };

  // Actions
  actions: {
    onExport?: () => void | Promise<void>;
    onDelete?: () => void | Promise<void>;
    canExport: boolean;
    canDelete: boolean;
  };
};
