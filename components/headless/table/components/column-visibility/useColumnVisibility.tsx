import { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "../table-component/types";

export type ColumnVisibilityState = Record<string, boolean>;

export function createColumnVisibilityHook<TRow>(prefix?: string) {
  return function useColumnVisibility(columns: ColumnDef<TRow>[]) {
    const storageKey = prefix ? `table-${prefix}-column-visibility` : null;

    // Initialize visibility state - all columns visible by default
    const getInitialVisibility = useCallback((): ColumnVisibilityState => {
      if (!storageKey) {
        // No prefix, no persistence
        return columns.reduce((acc, col) => {
          acc[col.key] = true;
          return acc;
        }, {} as ColumnVisibilityState);
      }

      // Try to load from localStorage
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as ColumnVisibilityState;
          // Ensure all current columns are in the state
          const visibility: ColumnVisibilityState = {};
          columns.forEach((col) => {
            visibility[col.key] = parsed[col.key] ?? true;
          });
          return visibility;
        }
      } catch (error) {
        console.error(
          "Failed to load column visibility from localStorage:",
          error,
        );
      }

      // Default: all visible
      return columns.reduce((acc, col) => {
        acc[col.key] = true;
        return acc;
      }, {} as ColumnVisibilityState);
    }, [columns, storageKey]);

    const [columnVisibility, setColumnVisibility] =
      useState<ColumnVisibilityState>(getInitialVisibility);

    // Save to localStorage whenever visibility changes
    useEffect(() => {
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(columnVisibility));
        } catch (error) {
          console.error(
            "Failed to save column visibility to localStorage:",
            error,
          );
        }
      }
    }, [columnVisibility, storageKey]);

    // Toggle a single column
    const toggleColumn = useCallback((columnKey: string) => {
      setColumnVisibility((prev) => ({
        ...prev,
        [columnKey]: !prev[columnKey],
      }));
    }, []);

    // Show all columns
    const showAllColumns = useCallback(() => {
      setColumnVisibility((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          newState[key] = true;
        });
        return newState;
      });
    }, []);

    // Hide all columns
    const hideAllColumns = useCallback(() => {
      setColumnVisibility((prev) => {
        const newState = { ...prev };
        Object.keys(newState).forEach((key) => {
          newState[key] = false;
        });
        return newState;
      });
    }, []);

    // Reset to default (all visible)
    const resetColumnVisibility = useCallback(() => {
      const defaultState = columns.reduce((acc, col) => {
        acc[col.key] = true;
        return acc;
      }, {} as ColumnVisibilityState);
      setColumnVisibility(defaultState);
    }, [columns]);

    // Get visible columns
    const visibleColumns = columns.filter(
      (col) => columnVisibility[col.key] !== false,
    );

    // Count visible columns
    const visibleCount = visibleColumns.length;
    const totalCount = columns.length;

    return {
      columnVisibility,
      setColumnVisibility,
      toggleColumn,
      showAllColumns,
      hideAllColumns,
      resetColumnVisibility,
      visibleColumns,
      allColumns: columns,
      visibleCount,
      totalCount,
      hasHiddenColumns: visibleCount < totalCount,
    };
  };
}
