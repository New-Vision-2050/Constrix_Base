// Shared types for dropdown components used in both table and form modules

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DynamicDropdownConfig {
  url: string;
  valueField: string;
  labelField: string;
  dependsOn?: string; // The field/column key this dropdown depends on
  filterParam?: string; // The parameter name to filter by in API calls
  searchParam?: string; // Parameter name for search query
  paginationEnabled?: boolean; // Whether to use pagination
  pageParam?: string; // Parameter name for page number
  limitParam?: string; // Parameter name for items per page
  itemsPerPage?: number; // Number of items to fetch per page
  totalCountHeader?: string; // Header containing total count information
  headers?: Record<string, string>; // Custom headers for the API request
  queryParameters?: Record<string, string>; // Additional query parameters
  transformResponse?: (data: unknown) => DropdownOption[]; // Transform API response to dropdown options
  enableServerSearch?: boolean; // Whether to enable server-side search
}

// Type for search/filter configuration
export interface SearchTypeConfig {
  type: 'text' | 'dropdown' | 'date' | 'number';
  placeholder?: string;
  dropdownOptions?: DropdownOption[]; // Static options
  dynamicDropdown?: DynamicDropdownConfig; // Dynamic options from API
}