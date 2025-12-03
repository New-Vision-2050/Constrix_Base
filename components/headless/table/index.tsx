import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  CircularProgress,
  TableSortLabel,
} from "@mui/material";
import { InboxOutlined, SearchOff } from "@mui/icons-material";

// ============================================================================
// Types
// ============================================================================

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

export type TableProps<TRow> = {
  columns: ColumnDef<TRow>[];
  data: TRow[];
  sortBy?: string; // The key of the column to sort by
  sort?: "asc" | "desc"; // Sort direction
  handleSort?: (key: string) => void; // Callback when sort is triggered
  filtered?: boolean; // Whether filters are applied (affects empty state message)
  loading?: boolean; // Loading state
};

export type TableLayoutProps = {
  filters?: React.ReactNode;
  table: React.ReactNode;
  pagination?: React.ReactNode;
};

// ============================================================================
// Headless Table Factory
// ============================================================================

export function HeadlessTableLayout<TRow>() {
  // Table Component
  const TableComponent = ({
    columns,
    data,
    sortBy,
    sort,
    handleSort,
    filtered = false,
    loading = false,
  }: TableProps<TRow>) => {
    const handleColumnSort = (columnKey: string, sortable?: boolean) => {
      if (sortable && handleSort) {
        handleSort(columnKey);
      }
    };

    // Render Loading State in Table Body
    const renderLoadingState = () => (
      <TableRow>
        <TableCell colSpan={columns.length} sx={{ border: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
              flexDirection: "column",
              gap: 2,
            }}
          >
            <CircularProgress size={48} />
            <Typography variant="body1" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        </TableCell>
      </TableRow>
    );

    // Render Empty State in Table Body
    const renderEmptyState = () => (
      <TableRow>
        <TableCell colSpan={columns.length} sx={{ border: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
              flexDirection: "column",
              gap: 2,
              color: "text.secondary",
            }}
          >
            {filtered ? (
              <>
                <SearchOff sx={{ fontSize: 64, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">
                  No results found
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Try adjusting your filters
                </Typography>
              </>
            ) : (
              <>
                <InboxOutlined sx={{ fontSize: 64, opacity: 0.5 }} />
                <Typography variant="h6" color="text.secondary">
                  No data
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  There is no data to display
                </Typography>
              </>
            )}
          </Box>
        </TableCell>
      </TableRow>
    );

    return (
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "action.hover",
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.key}
                      direction={sortBy === column.key ? sort || "asc" : "asc"}
                      onClick={() =>
                        handleColumnSort(column.key, column.sortable)
                      }
                    >
                      {column.name}
                    </TableSortLabel>
                  ) : (
                    column.name
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? renderLoadingState()
              : data.length === 0
              ? renderEmptyState()
              : data.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render(row, index, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // TableLayout Component
  const TableLayoutComponent = ({
    filters,
    table,
    pagination,
  }: TableLayoutProps) => {
    return (
      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 2 }}
      >
        {filters && (
          <Paper sx={{ p: 2 }} variant="outlined">
            {filters}
          </Paper>
        )}
        <Box>{table}</Box>
        {pagination && (
          <Paper sx={{ p: 2 }} variant="outlined">
            {pagination}
          </Paper>
        )}
      </Box>
    );
  };

  // Attach Table as a property of TableLayout
  TableLayoutComponent.Table = TableComponent;

  return TableLayoutComponent;
}

// ============================================================================
// Exports
// ============================================================================

export default HeadlessTableLayout;
