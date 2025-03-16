
// Common types and interfaces for table functionality

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
}

export interface TableData {
  [key: string]: any;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortState {
  column: string | null;
  direction: SortDirection;
}

export interface SearchConfig {
  defaultFields?: string[];
  paramName?: string;
  fieldParamName?: string;
  allowFieldSelection?: boolean;
}

export interface ColumnSearchState {
  [columnKey: string]: string | string[];
}

// New types for enhanced dropdown search functionality
export type SearchType = 'text' | 'dropdown' | 'date' | 'number';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DynamicDropdownConfig {
  url: string;
  valueField: string;
  labelField: string;
  dependsOn?: string; // The column key this dropdown depends on
  filterParam?: string; // The parameter name to filter by in API calls
  searchParam?: string; // Parameter name for search query
  paginationEnabled?: boolean; // Whether to use pagination
  pageParam?: string; // Parameter name for page number
  limitParam?: string; // Parameter name for items per page
  itemsPerPage?: number; // Number of items to fetch per page
  totalCountHeader?: string; // Header containing total count information
}

export interface SearchTypeConfig {
  type: SearchType;
  placeholder?: string;
  dropdownOptions?: DropdownOption[]; // Static options
  dynamicDropdown?: DynamicDropdownConfig; // Dynamic options from API
}

export interface ColumnSearchConfig {
  [columnKey: string]: SearchTypeConfig;
}
