// ============================================================================
// Table Params Types (Before Query)
// ============================================================================

export type TableParamsOptions = {
  // Initial pagination values
  initialPage?: number;
  initialLimit?: number;

  // Initial sorting
  initialSortBy?: string;
  initialSortDirection?: "asc" | "desc";

  // Initial search
  initialSearch?: string;
};

export type TableParams = {
  // Pagination params
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;

  // Sorting params
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  handleSort: (key: string) => void;

  // Search params
  search: string;
  setSearch: (search: string) => void;

  // Reset all params
  reset: () => void;
};
