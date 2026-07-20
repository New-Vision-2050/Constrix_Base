import React, {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  TableSortLabel,
  Skeleton,
  Checkbox,
  Alert,
  Chip,
} from "@mui/material";
import { InboxOutlined, SearchOff } from "@mui/icons-material";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ColumnDef, TableProps } from "./types";

// ============================================================================
// Table Component Factory
// ============================================================================

// Prevents tableLayout: "auto" from shrinking columns indefinitely when there
// are many of them — once column minimums exceed the container, the table
// overflows and TableContainer's overflow-x scrolls instead of cramping cells.
const DEFAULT_COLUMN_MIN_WIDTH = 120;

export function createTableComponent<TRow>() {
  const TableComponent = (props: TableProps<TRow>) => {
    const t = useTranslations("Table");
    /** Avoid hydration mismatch: next-themes is undefined on the server but may match localStorage on first client paint. */
    const [themeReady, setThemeReady] = useState(false);
    useEffect(() => {
      setThemeReady(true);
    }, []);
    const { theme: currentTheme } = useTheme();
    const isGreenTheme =
      themeReady &&
      (currentTheme === "green-light" || currentTheme === "green-dark");

    // Extract props based on whether state is provided
    const isUsingState = "state" in props && props.state !== undefined;

    const columns = isUsingState ? props.state.table.columns : props.columns;
    const data = isUsingState ? props.state.table.data : props.data;
    const sortBy = isUsingState ? props.state.table.sortBy : props.sortBy;
    const sort = isUsingState ? props.state.table.sortDirection : props.sort;
    const handleSort = isUsingState
      ? props.state.table.handleSort
      : props.handleSort;
    const filtered = isUsingState
      ? props.state.table.filtered
      : props.filtered || false;
    const loading = isUsingState
      ? props.state.table.loading
      : props.loading || false;
    const getRowSx = isUsingState
      ? props.state.table.getRowSx
      : undefined;
    const pinnedColumnCount = isUsingState
      ? props.state.table.pinnedColumnCount
      : props.pinnedColumnCount || 0;
    const loadingOptions = props.loadingOptions || { rows: 5 };

    // Selection config
    const selectable = isUsingState
      ? props.state.table.selectable
        ? {
            selectedRows: props.state.selection.selectedRows,
            onSelectionChange: props.state.selection.setSelectedRows,
            getRowId: undefined, // Will use state's internal logic
          }
        : undefined
      : props.selectable;

    // Use state's selection methods when available
    const stateSelection =
      isUsingState && props.state.table.selectable
        ? props.state.selection
        : null;
    const getRowKeyFromState = isUsingState
      ? props.state.selection.getRowKey
      : undefined;
    const selectedCount =
      isUsingState && props.state.table.selectable
        ? props.state.selection.selectedCount
        : 0;
    const handleColumnSort = (columnKey: string, sortable?: boolean) => {
      if (sortable && handleSort) {
        handleSort(columnKey);
      }
    };

    // Fixed/pinned columns: the selection checkbox column (if present) is
    // treated as sticky alongside the leading pinned data columns, but only
    // once at least one column is actually pinned, so tables that don't use
    // this feature render exactly as before.
    const stickyCount =
      pinnedColumnCount > 0
        ? (selectable ? 1 : 0) + pinnedColumnCount
        : 0;

    const headerCellRefs = useRef<Array<HTMLTableCellElement | null>>([]);
    const [stickyOffsets, setStickyOffsets] = useState<number[]>([]);

    const measureStickyOffsets = useCallback(() => {
      const offsets: number[] = [];
      let cumulative = 0;
      for (let i = 0; i < stickyCount; i++) {
        offsets.push(cumulative);
        cumulative += headerCellRefs.current[i]?.getBoundingClientRect().width ?? 0;
      }
      setStickyOffsets(offsets);
    }, [stickyCount]);

    // Column widths are content-driven (tableLayout: "auto"), so re-measure
    // whenever the sticky column set, data, or loading state changes.
    useLayoutEffect(() => {
      measureStickyOffsets();
    }, [measureStickyOffsets, columns, data, loading]);

    useEffect(() => {
      if (stickyCount === 0) return undefined;
      const cells = headerCellRefs.current.slice(0, stickyCount);
      const observer = new ResizeObserver(() => measureStickyOffsets());
      cells.forEach((cell) => {
        if (cell) observer.observe(cell);
      });
      return () => observer.disconnect();
    }, [stickyCount, measureStickyOffsets]);

    // minWidth stops the column from shrinking away; overflowWrap lets long
    // unbroken content (emails, IDs, URLs) break and wrap within that width
    // instead of spilling out of the cell.
    const getColumnSizingSx = (column: ColumnDef<TRow>) => ({
      minWidth: column.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH,
      overflowWrap: "anywhere" as const,
    });

    const getStickyHeaderSx = (index: number) =>
      index < stickyCount
        ? {
            position: "sticky" as const,
            left: stickyOffsets[index] ?? 0,
            zIndex: 3,
            backgroundColor: isGreenTheme
              ? "primary.main"
              : "background.default",
            ...(index === stickyCount - 1 && {
              borderRight: "1px solid",
              borderRightColor: "divider",
            }),
          }
        : undefined;

    const getStickyBodySx = (index: number) =>
      index < stickyCount
        ? {
            position: "sticky" as const,
            left: stickyOffsets[index] ?? 0,
            zIndex: 1,
            backgroundColor: "inherit",
            ...(index === stickyCount - 1 && {
              borderRight: "1px solid",
              borderRightColor: "divider",
            }),
          }
        : undefined;

    // Selection helpers
    const getRowId = (row: TRow, index: number): string | number => {
      if (getRowKeyFromState) {
        return getRowKeyFromState(row);
      }
      return selectable?.getRowId ? selectable.getRowId(row) : index;
    };

    const getRowKey = (row: TRow, index: number): string | number => {
      return getRowId(row, index);
    };

    const isRowSelected = (row: TRow, index: number): boolean => {
      if (!selectable) return false;
      // Use state's selection method if available
      if (stateSelection) {
        return stateSelection.isRowSelected(row);
      }
      const rowId = getRowId(row, index);
      return selectable.selectedRows.some(
        (selectedRow, selectedIndex) =>
          getRowId(selectedRow, selectedIndex) === rowId,
      );
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectable) return;
      // Use state's selection methods if available
      if (stateSelection) {
        if (event.target.checked) {
          stateSelection.selectAll();
        } else {
          stateSelection.clearSelection();
        }
        return;
      }
      if (event.target.checked) {
        selectable.onSelectionChange(data);
      } else {
        selectable.onSelectionChange([]);
      }
    };

    const handleRowSelect = (row: TRow, index: number) => {
      if (!selectable) return;
      // Use state's toggle method if available
      if (stateSelection) {
        stateSelection.toggleRow(row);
        return;
      }
      const rowId = getRowId(row, index);
      const isSelected = isRowSelected(row, index);

      if (isSelected) {
        const newSelection = selectable.selectedRows.filter(
          (selectedRow, selectedIndex) =>
            getRowId(selectedRow, selectedIndex) !== rowId,
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
            <TableRow key={rowIndex} sx={{ backgroundColor: "background.paper" }}>
              {selectable && (
                <TableCell padding="checkbox" sx={getStickyBodySx(0)}>
                  <Skeleton variant="rectangular" width={42} height={42} />
                </TableCell>
              )}
              {columns.map((column, columnIndex) => (
                <TableCell
                  key={column.key}
                  sx={{
                    ...getColumnSizingSx(column),
                    ...getStickyBodySx((selectable ? 1 : 0) + columnIndex),
                  }}
                >
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
                    {t("NoResultsFound")}
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    {t("NoResultsDescription")}
                  </Typography>
                </>
              ) : (
                <>
                  <InboxOutlined sx={{ fontSize: 64, opacity: 0.5 }} />
                  <Typography variant="h6" color="text.secondary">
                    {t("NoData")}
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    {t("NoDataDescription")}
                  </Typography>
                </>
              )}
            </Box>
          </TableCell>
        </TableRow>
      );
    };

    return (
      <>
        {selectedCount > 0 && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderRadius: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Chip
                label={`${selectedCount} ${selectedCount === 1 ? t("Selected") : t("SelectedRows")}`}
                color="primary"
                variant="filled"
                sx={{ fontWeight: "600" }}
              />
              <Typography variant="body2" color="textSecondary">
                {t("SelectedRowsMessage")}
              </Typography>
            </Box>
          </Alert>
        )}
        <TableContainer>
        <Table
          sx={{
            tableLayout: "auto",
            borderTopWidth: 1,
            borderTopColor: "divider",
            borderTopStyle: "solid",
            borderBottomWidth: 1,
            borderBottomColor: "divider",
            borderBottomStyle: "solid",
            ".MuiTableCell-root": {
              borderBottomWidth: 1,
              borderBottomColor: "divider",
              borderBottomStyle: "solid",
              padding: 1,
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                ".MuiTableCell-root": {
                  fontWeight: 600,
                  backgroundColor: isGreenTheme
                    ? "primary.main"
                    : "background.default",
                  color: isGreenTheme
                    ? "primary.contrastText"
                    : "text.primary",
                },
              }}
            >
              {selectable && (
                <TableCell
                  padding="checkbox"
                  ref={(el: HTMLTableCellElement | null) => {
                    headerCellRefs.current[0] = el;
                  }}
                  sx={getStickyHeaderSx(0)}
                >
                  <Checkbox
                    indeterminate={isSomeSelected}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    disabled={loading || data.length === 0}
                    sx={
                      isGreenTheme
                        ? {
                            color: "primary.contrastText",
                            "&.Mui-checked": {
                              color: "primary.contrastText",
                            },
                            "&.MuiCheckbox-indeterminate": {
                              color: "primary.contrastText",
                            },
                          }
                        : {}
                    }
                  />
                </TableCell>
              )}
              {columns.map((column, columnIndex) => {
                const stickyIndex = (selectable ? 1 : 0) + columnIndex;
                return (
                <TableCell
                  key={column.key}
                  align={column.align || "left"}
                  ref={(el: HTMLTableCellElement | null) => {
                    if (stickyIndex < stickyCount) {
                      headerCellRefs.current[stickyIndex] = el;
                    }
                  }}
                  sx={{
                    ...getColumnSizingSx(column),
                    ...getStickyHeaderSx(stickyIndex),
                  }}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={sortBy === column.key}
                      direction={sortBy === column.key ? sort || "asc" : "asc"}
                      onClick={() =>
                        handleColumnSort(column.key, column.sortable)
                      }
                      sx={
                        isGreenTheme
                          ? {
                              color: "primary.contrastText !important",
                              "&.Mui-active": {
                                color: "primary.contrastText !important",
                              },
                              "& .MuiTableSortLabel-icon": {
                                color: "primary.contrastText !important",
                              },
                            }
                          : {}
                      }
                    >
                      {column.name}
                    </TableSortLabel>
                  ) : (
                    column.name
                  )}
                </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? renderLoadingState()
              : data.length === 0
                ? renderEmptyState()
                : data.map((row, index) => {
                    const selected = isRowSelected(row, index);
                    const isSticky =
                      stateSelection?.isRowFromOtherPage(row) || false;
                    const rowSx = getRowSx ? getRowSx(row, index) : undefined;
                    return (
                      <TableRow
                        key={getRowKey(row, index)}
                        hover
                        selected={selected}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          // Sticky cells use backgroundColor: "inherit", so the
                          // row needs an opaque baseline whenever columns are
                          // fixed, otherwise scrolled-under content bleeds
                          // through the sticky cells in the default row state.
                          ...(stickyCount > 0 && {
                            backgroundColor: "background.paper",
                          }),
                          ...(isGreenTheme &&
                            !selected &&
                            index % 2 === 1 && {
                              backgroundColor:
                                currentTheme === "green-light"
                                  ? "#F7FDF9"
                                  : "#14573A",
                            }),
                          ...(isSticky && {
                            backgroundColor: "action.hover",
                            borderLeft: "3px solid",
                            borderLeftColor: "primary.main",
                          }),
                          ...rowSx,
                        }}
                      >
                        {selectable && (
                          <TableCell padding="checkbox" sx={getStickyBodySx(0)}>
                            <Checkbox
                              checked={selected}
                              onChange={() => handleRowSelect(row, index)}
                            />
                          </TableCell>
                        )}
                        {columns.map((column, columnIndex) => (
                          <TableCell
                            key={column.key}
                            align={column.align || "left"}
                            sx={{
                              ...getColumnSizingSx(column),
                              ...getStickyBodySx(
                                (selectable ? 1 : 0) + columnIndex,
                              ),
                            }}
                          >
                            {column.render(row, index, column)}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
          </TableBody>
        </Table>
        </TableContainer>
      </>
    );
  };

  return TableComponent;
}
