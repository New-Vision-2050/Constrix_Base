import { ColumnDef } from "../table-component/types";
import { TableParams } from "../table-params/types";
import { ColumnVisibilityState } from "../column-visibility";

// ============================================================================
// Table State Types (After Query)
// ============================================================================

export type TableStateV2Options<TRow> = {
  // Data from query
  data: TRow[];
  columns: ColumnDef<TRow>[];

  // Pagination info from backend
  totalPages: number;
  totalItems?: number;

  // Params from useTableParams
  params: TableParams;

  // Selection
  selectable?: boolean;
  getRowId?: (row: TRow) => string;

  // Search
  searchable?: boolean;

  // Column Visibility
  columnVisibility?: {
    columnVisibility: ColumnVisibilityState;
    toggleColumn: (columnKey: string) => void;
    showAllColumns: () => void;
    hideAllColumns: () => void;
    resetColumnVisibility: () => void;
    visibleColumns: ColumnDef<TRow>[];
    allColumns: ColumnDef<TRow>[];
    visibleCount: number;
    totalCount: number;
    hasHiddenColumns: boolean;
  };

  // Loading & Filtering
  loading?: boolean;
  filtered?: boolean;

  // Actions
  onExport?: (selectedRows: TRow[]) => void | Promise<void>;
  onDelete?: (selectedRows: TRow[]) => void | Promise<void>;
};

export type TableStateV2<TRow> = {
  // Table-specific state
  table: {
    columns: ColumnDef<TRow>[];
    data: TRow[]; // With sticky selected rows
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    loading: boolean;
    filtered: boolean;
    handleSort: (key: string) => void;
    selectable: boolean;
    searchable: boolean;
  };

  // Column Visibility state (optional, only if prefix provided)
  columnVisibility?: {
    columnVisibility: ColumnVisibilityState;
    toggleColumn: (columnKey: string) => void;
    showAllColumns: () => void;
    hideAllColumns: () => void;
    resetColumnVisibility: () => void;
    visibleColumns: ColumnDef<TRow>[];
    allColumns: ColumnDef<TRow>[];
    visibleCount: number;
    totalCount: number;
    hasHiddenColumns: boolean;
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
    paginatedData: TRow[]; // Same as table.data (for backward compatibility)
  };

  // Search state
  search: {
    search: string;
    setSearch: (search: string) => void;
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
    isRowFromOtherPage: (row: TRow) => boolean;
  };

  // Actions
  actions: {
    onExport?: () => void | Promise<void>;
    onDelete?: () => void | Promise<void>;
    canExport: boolean;
    canDelete: boolean;
  };
};
