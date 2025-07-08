
// Common types and interfaces for table functionality

import {DependencyConfig, DynamicDropdownConfig} from "@/modules/form-builder/types/formTypes";

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

export interface SearchTypeConfig {
  type: SearchType;
  placeholder?: string;
  dropdownOptions?: DropdownOption[]; // Static options
  dynamicDropdown?: DynamicDropdownConfig; // Dynamic options from API
  isMulti?: boolean;
  defaultValue?: string | string[] | Date | number; // Valor predeterminado para el campo
}

export interface ColumnSearchConfig {
  [columnKey: string]: SearchTypeConfig;
}
