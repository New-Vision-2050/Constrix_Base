
import { ColumnSearchConfig } from '../tableTypes';
import { ColumnConfig } from './columnConfig';

export interface TableConfig {
  url: string;
  columns?: ColumnConfig[];
  defaultItemsPerPage?: number;
  defaultSortColumn?: string;
  defaultSortDirection?: 'asc' | 'desc' | null;
  defaultSearchQuery?: string;
  enableSorting?: boolean;
  enablePagination?: boolean;
  enableSearch?: boolean;
  dataMapper?: (data: any) => any[];
  // Search configuration options
  searchFields?: string[];
  searchParamName?: string;
  searchFieldParamName?: string;
  allowSearchFieldSelection?: boolean;
  // New option for per-column search
  enableColumnSearch?: boolean;
  columnSearchConfig?: ColumnSearchConfig;
}
