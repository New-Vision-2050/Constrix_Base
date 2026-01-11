import { useState, useMemo, useCallback } from "react";
import { TableState, TableStateOptions } from "./types";

// ============================================================================
// Table State Hook Factory
// ============================================================================

export function createTableStateHook<TRow>() {
  return function useTableState(
    options: TableStateOptions<TRow>
  ): TableState<TRow> {
    const {
      data,
      columns,
      pagination: paginationConfig,
      selectable = false,
      getRowId,
      initialSortBy,
      initialSortDirection = "asc",
      loading = false,
      filtered = false,
      onExport,
      onDelete,
    } = options;

    // Pagination state
    const [page, setPage] = useState(paginationConfig?.page || 1);
    const [limit, setLimit] = useState(paginationConfig?.limit || 10);

    // Total pages: use from config if provided (backend), otherwise calculate from totalItems
    const totalPages = paginationConfig?.totalPages
      ? paginationConfig.totalPages
      : Math.ceil((paginationConfig?.totalItems || data.length) / limit);

    const totalItems = paginationConfig?.totalItems || data.length;

    // Selection state
    const [selectedRows, setSelectedRows] = useState<TRow[]>([]);

    // Sorting state
    const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
      initialSortDirection
    );

    // Computed pagination values
    const canNextPage = page < totalPages;
    const canPrevPage = page > 1;

    // Paginated data with selected rows at top
    const paginatedData = useMemo(() => {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const pageData = data.slice(startIndex, endIndex);

      // Get selected rows that are NOT in the current page
      const selectedRowsNotInPage = selectedRows.filter((selectedRow) => {
        return !pageData.some((pageRow) => {
          const selectedId = getRowId
            ? getRowId(selectedRow)
            : JSON.stringify(selectedRow);
          const pageId = getRowId ? getRowId(pageRow) : JSON.stringify(pageRow);
          return selectedId === pageId;
        });
      });

      // Merge: selected rows from other pages first, then current page data
      return [...selectedRowsNotInPage, ...pageData];
    }, [data, page, limit, selectedRows, getRowId]);

    // Pagination actions
    const nextPage = useCallback(() => {
      if (canNextPage) setPage((p) => p + 1);
    }, [canNextPage]);

    const prevPage = useCallback(() => {
      if (canPrevPage) setPage((p) => p - 1);
    }, [canPrevPage]);

    const handleSetLimit = useCallback((newLimit: number) => {
      setLimit(newLimit);
      setPage(1); // Reset to first page when limit changes
    }, []);

    // Sorting handler
    const handleSort = useCallback(
      (key: string) => {
        if (sortBy === key) {
          setSortDirection((dir) => (dir === "asc" ? "desc" : "asc"));
        } else {
          setSortBy(key);
          setSortDirection("asc");
        }
      },
      [sortBy]
    );

    // Selection helpers
    const getRowIdentifier = useCallback(
      (row: TRow): string => {
        if (getRowId) {
          return getRowId(row);
        }
        // Fallback: use JSON stringify for object comparison
        return JSON.stringify(row);
      },
      [getRowId]
    );

    const isRowSelected = useCallback(
      (row: TRow): boolean => {
        const rowId = getRowIdentifier(row);
        return selectedRows.some(
          (selectedRow) => getRowIdentifier(selectedRow) === rowId
        );
      },
      [selectedRows, getRowIdentifier]
    );

    const toggleRow = useCallback(
      (row: TRow) => {
        const rowId = getRowIdentifier(row);
        const isSelected = isRowSelected(row);

        if (isSelected) {
          setSelectedRows((prev) =>
            prev.filter(
              (selectedRow) => getRowIdentifier(selectedRow) !== rowId
            )
          );
        } else {
          setSelectedRows((prev) => [...prev, row]);
        }
      },
      [getRowIdentifier, isRowSelected]
    );

    const clearSelection = useCallback(() => {
      setSelectedRows([]);
    }, []);

    const selectAll = useCallback(() => {
      // Select all visible rows on current page (excluding sticky selected rows from other pages)
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const currentPageData = data.slice(startIndex, endIndex);

      // Merge with existing selected rows from other pages
      const selectedRowsNotInPage = selectedRows.filter((selectedRow) => {
        return !currentPageData.some((pageRow) => {
          const selectedId = getRowId
            ? getRowId(selectedRow)
            : JSON.stringify(selectedRow);
          const pageId = getRowId ? getRowId(pageRow) : JSON.stringify(pageRow);
          return selectedId === pageId;
        });
      });

      setSelectedRows([...selectedRowsNotInPage, ...currentPageData]);
    }, [page, limit, data, selectedRows, getRowId]);

    // Check if a row is from another page (sticky row)
    const isRowFromOtherPage = useCallback(
      (row: TRow): boolean => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const currentPageData = data.slice(startIndex, endIndex);

        const rowId = getRowIdentifier(row);
        const isInCurrentPage = currentPageData.some(
          (pageRow) => getRowIdentifier(pageRow) === rowId
        );

        return !isInCurrentPage && isRowSelected(row);
      },
      [page, limit, data, getRowIdentifier, isRowSelected]
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
        data: paginatedData,
        sortBy,
        sortDirection,
        loading,
        filtered,
        handleSort,
        selectable,
      },
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        setPage,
        setLimit: handleSetLimit,
        nextPage,
        prevPage,
        canNextPage,
        canPrevPage,
        paginatedData,
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
