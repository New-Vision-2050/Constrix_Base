import { ReactNode } from "react";
import { ColumnSearchConfig } from "../tableTypes";
import { ColumnConfig } from "./columnConfig";

export interface TableConfig {
  url: string;
  tableId?: string; // Unique identifier for the table instance
  apiParams?: Record<string, string>;
  columns?: ColumnConfig[];
  availableColumnKeys?: string[]; // New: Array of column keys that should be available, filtering out others
  defaultVisibleColumnKeys?: string[]; // New: Array of column keys that should be visible by default
  defaultItemsPerPage?: number;
  defaultSortColumn?: string;
  defaultSortDirection?: "asc" | "desc" | null;
  defaultSearchQuery?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableSearch?: boolean;
  enableRowSelection?: boolean; // Row selection is enabled by default, set to false to disable
  enableExport?: boolean;
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
  deleteConfirmMessage?: string;
  deleteUrl?:string;
}
