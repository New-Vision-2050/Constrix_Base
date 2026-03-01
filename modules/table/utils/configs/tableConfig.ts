import { ReactNode } from "react";
import { ColumnSearchConfig } from "../tableTypes";
import { ColumnConfig } from "./columnConfig";
import { FormConfig } from "@/modules/form-builder/types/formTypes";

// Define types for dialog props
export interface DialogProps {
  open?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  title?: string;
  shouldReloadTable?: boolean;
  [key: string]: unknown;
}

// Define render function type for custom executions
export type RenderFunctionType = (row: {
  id: string;
  [key: string]: unknown;
}) => ReactNode;

// Define types for menu items (executions)
export type MenuItem = {
  label: string;
  icon?: ReactNode;
  action: string | ((row: { id: string; [key: string]: unknown }) => void);
  color?: string;
  disabled?: boolean;
  dialogComponent?: ReactNode | ((props: DialogProps) => ReactNode);
  dialogProps?:
    | DialogProps
    | ((row: { id: string; [key: string]: unknown }) => DialogProps);
  position?: "before" | "after";
};

// Define execution configuration
export interface ExecutionConfig {
  canEdit?: boolean;
  canDelete?: boolean;
}

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
  dataMapper?: (data: unknown) => unknown[];
  // Search configuration options
  searchFields?: string[];
  searchParamName?: string;
  searchFieldParamName?: string;
  allowSearchFieldSelection?: boolean;
  // New option for per-column search
  enableColumnSearch?: boolean;
  columnSearchConfig?: ColumnSearchConfig;
  // Additional search fields for advanced filtering
  allSearchedFields?: Record<string, unknown>[];
  hideSearchField?: boolean;
  tableTitle?: string;
  deleteConfirmMessage?: string;
  deleteUrl?: string;
  onDeleteSuccess?: () => void;
  // Execution configuration
  executions?: (MenuItem | RenderFunctionType)[];
  executionConfig?: ExecutionConfig;
  formConfig?: FormConfig;
}
