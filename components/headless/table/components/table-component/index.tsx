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
  TableSortLabel,
  Skeleton,
  Checkbox,
} from "@mui/material";
import { InboxOutlined, SearchOff } from "@mui/icons-material";
import { TableProps } from "./types";

// ============================================================================
// Table Component Factory
// ============================================================================

export function createTableComponent<TRow>() {
  const TableComponent = ({
    columns,
    data,
    sortBy,
    sort,
    handleSort,
    filtered = false,
    loading = false,
    loadingOptions = { rows: 5 },
    selectable,
  }: TableProps<TRow>) => {
    const handleColumnSort = (columnKey: string, sortable?: boolean) => {
      if (sortable && handleSort) {
        handleSort(columnKey);
      }
    };

    // Selection helpers
    const getRowId = (row: TRow, index: number): string | number => {
      return selectable?.getRowId ? selectable.getRowId(row) : index;
    };

    const isRowSelected = (row: TRow, index: number): boolean => {
      if (!selectable) return false;
      const rowId = getRowId(row, index);
      return selectable.selectedRows.some(
        (selectedRow, selectedIndex) =>
          getRowId(selectedRow, selectedIndex) === rowId
      );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectable) return;
      if (event.target.checked) {
        selectable.onSelectionChange(data);
      } else {
        selectable.onSelectionChange([]);
      }
    };

    const handleRowSelect = (row: TRow, index: number) => {
      if (!selectable) return;
      const rowId = getRowId(row, index);
      const isSelected = isRowSelected(row, index);

      if (isSelected) {
        const newSelection = selectable.selectedRows.filter(
          (selectedRow, selectedIndex) =>
            getRowId(selectedRow, selectedIndex) !== rowId
        );
        selectable.onSelectionChange(newSelection);
      } else {
        selectable.onSelectionChange([...selectable.selectedRows, row]);
      }
    };

    const isAllSelected = selectable
      ? data.length > 0 && selectable.selectedRows.length === data.length
      : false;

    const isSomeSelected = selectable
      ? selectable.selectedRows.length > 0 &&
        selectable.selectedRows.length < data.length
      : false;

    // Render Loading State in Table Body
    const renderLoadingState = () => {
      const skeletonRows = loadingOptions.rows || 5;
      return (
        <>
          {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {selectable && (
                <TableCell padding="checkbox">
                  <Skeleton variant="rectangular" width={42} height={42} />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Skeleton width={"100px"} variant="text" animation="wave" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      );
    };

    // Render Empty State in Table Body
    const renderEmptyState = () => {
      const colSpan = selectable ? columns.length + 1 : columns.length;
      return (
        <TableRow>
          <TableCell colSpan={colSpan} sx={{ border: 0 }}>
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
    };

    return (
      <TableContainer component={Paper} elevation={0} variant="outlined">
        <Table sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell
                  padding="checkbox"
                  sx={{
                    fontWeight: 600,
                    backgroundColor: "action.hover",
                  }}
                >
                  <Checkbox
                    indeterminate={isSomeSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={loading || data.length === 0}
                  />
                </TableCell>
              )}
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
              : data.map((row, index) => {
                  const selected = isRowSelected(row, index);
                  return (
                    <TableRow
                      key={index}
                      hover
                      selected={selected}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      {selectable && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selected}
                            onChange={() => handleRowSelect(row, index)}
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render(row, index, column)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return TableComponent;
}
