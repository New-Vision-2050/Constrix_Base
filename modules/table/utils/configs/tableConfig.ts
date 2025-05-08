import { ColumnSearchConfig } from "../tableTypes";
import { ColumnConfig } from "./columnConfig";

export interface TableConfig {
  url: string;
  tableId?: string; // Unique identifier for the table instance
  columns?: ColumnConfig[];
  defaultItemsPerPage?: number;
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc" | null;
  defaultSearchQuery?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableSearch?: boolean;
  enableRowSelection?: boolean; // Row selection is enabled by default, set to false to disable
  dataMapper?: (data: any) => any[];
  // Search configuration options
  searchFields?: string[];
  searchParamName?: string;
  searchFieldParamName?: string;
  allowSearchFieldSelection?: boolean;
  // New option for per-column search
  enableColumnSearch?: boolean;
  columnSearchConfig?: ColumnSearchConfig;
  // Additional search fields for advanced filtering
  allSearchedFields?: any[];
  hideSearchField?: boolean;
  tableTitle?: string;
}
