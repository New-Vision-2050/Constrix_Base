// Shared types for dropdown components

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