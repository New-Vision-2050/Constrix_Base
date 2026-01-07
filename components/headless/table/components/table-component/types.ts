import React from "react";

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

export type TableProps<TRow> = {
  columns: ColumnDef<TRow>[];
  data: TRow[];
  sortBy?: string; // The key of the column to sort by
  sort?: "asc" | "desc"; // Sort direction
  handleSort?: (key: string) => void; // Callback when sort is triggered
  filtered?: boolean; // Whether filters are applied (affects empty state message)
  loading?: boolean; // Loading state
  loadingOptions?: LoadingOptions; // Loading state customization
  selectable?: SelectionConfig<TRow>; // Enable row selection with checkboxes
};
