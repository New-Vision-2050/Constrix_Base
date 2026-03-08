import React from "react";
import { TableState } from "../..";

export type ColumnDef<TRow> = {
  key: string; // Unique identifier for the column (used for sorting)
  name: string; // Display name for the column header
  sortable?: boolean; // Whether this column can be sorted
  render: (
    row: TRow,
    index: number,
    column: ColumnDef<TRow>
  ) => React.ReactNode;
};

export type LoadingOptions = {
  rows?: number; // Number of skeleton rows to display (default: 10)
};

export type SelectionConfig<TRow> = {
  selectedRows: TRow[]; // Array of selected row objects
  onSelectionChange: (selectedRows: TRow[]) => void; // Callback when selection changes
  getRowId?: (row: TRow) => string; // Function to get unique ID from row (default: uses index)
};

// Props when using state pattern
export type TablePropsWithState<TRow> = {
  state: TableState<TRow>;
  loadingOptions?: LoadingOptions;
};

// Props when using individual props (backward compatibility)
export type TablePropsWithoutState<TRow> = {
  columns: ColumnDef<TRow>[];
  data: TRow[];
  sortBy?: string;
  sort?: "asc" | "desc";
  handleSort?: (key: string) => void;
  filtered?: boolean;
  loading?: boolean;
  loadingOptions?: LoadingOptions;
  selectable?: SelectionConfig<TRow>;
  state?: never;
};

export type TableProps<TRow> =
  | TablePropsWithState<TRow>
  | TablePropsWithoutState<TRow>;
