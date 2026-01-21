import { useState, useMemo, useCallback } from "react";
import { TableStateV2, TableStateV2Options } from "./types";

// ============================================================================
// Table State Hook V2 (After Query)
// ============================================================================

export function createTableStateV2Hook<TRow>() {
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
      loading = false,
      filtered = false,
      onExport,
      onDelete,
    } = options;

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
        columns,
        data: dataWithStickyRows,
        sortBy: params.sortBy,
        sortDirection: params.sortDirection,
        loading,
        filtered,
        handleSort: params.handleSort,
        selectable,
        searchable,
      },
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
