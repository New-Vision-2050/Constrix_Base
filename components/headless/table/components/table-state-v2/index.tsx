import { useState, useMemo, useCallback } from "react";
import { TableStateV2, TableStateV2Options } from "./types";
import { createColumnVisibilityHook } from "../column-visibility";
import { createColumnPinningHook } from "../column-pinning";
import { createColumnOrderHook } from "../column-order";

// ============================================================================
// Table State Hook V2 (After Query)
// ============================================================================

export function createTableStateV2Hook<TRow>(prefix?: string) {
  // Create column order hook if prefix is provided, otherwise create a no-op hook
  const useColumnOrderHook = prefix
    ? createColumnOrderHook<TRow>(prefix)
    : () => null;

  // Create column visibility hook if prefix is provided, otherwise create a no-op hook
  const useColumnVisibilityHook = prefix
    ? createColumnVisibilityHook<TRow>(prefix)
    : () => null;

  // Create column pinning hook if prefix is provided, otherwise create a no-op hook
  const useColumnPinningHook = prefix
    ? createColumnPinningHook<TRow>(prefix)
    : () => null;

  return function useTableState(
    options: TableStateV2Options<TRow>,
  ): TableStateV2<TRow> {
    const {
      data,
      columns,
      totalPages,
      totalItems = 0,
      params,
      selectable = false,
      searchable = false,
      getRowId,
      getRowSx,
      loading = false,
      filtered = false,
      onExport,
      onDelete,
      columnVisibility: externalColumnVisibility,
      columnPinning: externalColumnPinning,
      columnOrder: externalColumnOrder,
    } = options;

    // Automatically create column order if prefix exists and not provided externally
    // Hook is always called unconditionally (returns null if no prefix)
    const internalColumnOrder = useColumnOrderHook(columns);
    const columnOrder =
      externalColumnOrder ?? internalColumnOrder ?? undefined;

    // Custom order (if any) becomes the base list visibility/pinning operate on,
    // so drag order is the single source of truth for everything downstream.
    const orderedColumns = columnOrder?.orderedColumns ?? columns;

    // Automatically create column visibility if prefix exists and not provided externally
    // Hook is always called unconditionally (returns null if no prefix)
    const internalColumnVisibility = useColumnVisibilityHook(orderedColumns);
    const columnVisibility =
      externalColumnVisibility ?? internalColumnVisibility ?? undefined;

    // Automatically create column pinning if prefix exists and not provided externally
    // Hook is always called unconditionally (returns null if no prefix)
    const internalColumnPinning = useColumnPinningHook(orderedColumns);
    const columnPinning =
      externalColumnPinning ?? internalColumnPinning ?? undefined;

    // Use visible columns if column visibility is enabled, otherwise use all columns
    const visibleColumns = columnVisibility?.visibleColumns ?? orderedColumns;

    // Pinned columns move to the front, keeping their relative order from
    // `visibleColumns` (i.e. the dragged/custom order), not pin-click order.
    const pinnedKeySet = new Set(columnPinning?.pinnedKeys ?? []);
    const pinnedVisibleColumns = visibleColumns.filter((col) =>
      pinnedKeySet.has(col.key),
    );
    const unpinnedVisibleColumns = visibleColumns.filter(
      (col) => !pinnedKeySet.has(col.key),
    );
    const activeColumns =
      pinnedVisibleColumns.length > 0
        ? [...pinnedVisibleColumns, ...unpinnedVisibleColumns]
        : visibleColumns;
    const pinnedColumnCount = pinnedVisibleColumns.length;

    // Selection state
    const [selectedRows, setSelectedRows] = useState<TRow[]>([]);

    // Computed pagination values
    const canNextPage = params.page < totalPages;
    const canPrevPage = params.page > 1;

    // Row identifier helper
    const getRowIdentifier = useCallback(
      (row: TRow): string => {
        return getRowId ? getRowId(row) : JSON.stringify(row);
      },
      [getRowId],
    );

    // Data with sticky selected rows at top
    const dataWithStickyRows = useMemo(() => {
      if (!selectable || selectedRows.length === 0) {
        return data;
      }

      // Get selected rows that are NOT in the current page
      const selectedRowsNotInPage = selectedRows.filter((selectedRow) => {
        return !data.some((pageRow) => {
          const selectedId = getRowIdentifier(selectedRow);
          const pageId = getRowIdentifier(pageRow);
          return selectedId === pageId;
        });
      });

      // Merge: selected rows from other pages first, then current page data
      return [...selectedRowsNotInPage, ...data];
    }, [data, selectedRows, getRowIdentifier, selectable]);

    // Selection helpers
    const isRowSelected = useCallback(
      (row: TRow): boolean => {
        const rowId = getRowIdentifier(row);
        return selectedRows.some(
          (selectedRow) => getRowIdentifier(selectedRow) === rowId,
        );
      },
      [selectedRows, getRowIdentifier],
    );

    const toggleRow = useCallback(
      (row: TRow) => {
        const rowId = getRowIdentifier(row);
        const isSelected = selectedRows.some(
          (selectedRow) => getRowIdentifier(selectedRow) === rowId,
        );

        if (isSelected) {
          setSelectedRows((prev) =>
            prev.filter(
              (selectedRow) => getRowIdentifier(selectedRow) !== rowId,
            ),
          );
        } else {
          setSelectedRows((prev) => [...prev, row]);
        }
      },
      [selectedRows, getRowIdentifier],
    );

    const clearSelection = useCallback(() => {
      setSelectedRows([]);
    }, []);

    const selectAll = useCallback(() => {
      // Select all visible rows on current page
      const selectedRowsNotInPage = selectedRows.filter((selectedRow) => {
        return !data.some((pageRow) => {
          const selectedId = getRowIdentifier(selectedRow);
          const pageId = getRowIdentifier(pageRow);
          return selectedId === pageId;
        });
      });

      setSelectedRows([...selectedRowsNotInPage, ...data]);
    }, [data, selectedRows, getRowIdentifier]);

    // Check if a row is from another page (sticky row)
    const isRowFromOtherPage = useCallback(
      (row: TRow): boolean => {
        const rowId = getRowIdentifier(row);
        const isInCurrentPage = data.some(
          (pageRow) => getRowIdentifier(pageRow) === rowId,
        );

        return !isInCurrentPage && isRowSelected(row);
      },
      [data, getRowIdentifier, isRowSelected],
    );

    // Action handlers
    const handleExport = useCallback(async () => {
      if (onExport) {
        await onExport(selectedRows);
      }
    }, [onExport, selectedRows]);

    const handleDelete = useCallback(async () => {
      if (onDelete) {
        await onDelete(selectedRows);
        clearSelection();
      }
    }, [onDelete, selectedRows, clearSelection]);

    // Return structured state
    return {
      table: {
        columns: activeColumns,
        data: dataWithStickyRows,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        loading,
        filtered,
        handleSort: params.handleSort,
        selectable,
        searchable,
        getRowSx,
        pinnedColumnCount,
      },
      columnVisibility,
      columnPinning,
      columnOrder,
      pagination: {
        page: params.page,
        limit: params.limit,
        totalItems,
        totalPages,
        setPage: params.setPage,
        setLimit: params.setLimit,
        nextPage: params.nextPage,
        prevPage: params.prevPage,
        canNextPage,
        canPrevPage,
        paginatedData: dataWithStickyRows,
      },
      search: {
        search: params.search,
        setSearch: params.setSearch,
      },
      selection: {
        selectedRows,
        setSelectedRows,
        clearSelection,
        selectAll,
        hasSelection: selectedRows.length > 0,
        selectedCount: selectedRows.length,
        isRowSelected,
        toggleRow,
        isRowFromOtherPage,
        getRowKey: getRowIdentifier,
      },
      actions: {
        onExport: onExport ? handleExport : undefined,
        onDelete: onDelete ? handleDelete : undefined,
        canExport: selectedRows.length > 0 && !!onExport,
        canDelete: selectedRows.length > 0 && !!onDelete,
      },
    };
  };
}
