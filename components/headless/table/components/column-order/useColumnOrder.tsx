import { useState, useEffect, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { ColumnDef } from "../table-component/types";

export type ColumnOrderState = string[];

export function createColumnOrderHook<TRow>(prefix?: string) {
  return function useColumnOrder(columns: ColumnDef<TRow>[]) {
    const storageKey = prefix ? `table-${prefix}-column-order` : null;

    const getInitialOrder = useCallback((): ColumnOrderState => {
      const allKeys = columns.map((col) => col.key);

      if (!storageKey) {
        return allKeys;
      }

      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as ColumnOrderState;
          const validKeys = new Set(allKeys);
          const existingOrder = parsed.filter((key) => validKeys.has(key));
          const orderedSet = new Set(existingOrder);
          const newKeys = allKeys.filter((key) => !orderedSet.has(key));
          return [...existingOrder, ...newKeys];
        }
      } catch (error) {
        console.error("Failed to load column order from localStorage:", error);
      }

      return allKeys;
    }, [columns, storageKey]);

    const [columnOrder, setColumnOrder] =
      useState<ColumnOrderState>(getInitialOrder);

    // Save to localStorage whenever order changes
    useEffect(() => {
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(columnOrder));
        } catch (error) {
          console.error("Failed to save column order to localStorage:", error);
        }
      }
    }, [columnOrder, storageKey]);

    const moveColumn = useCallback((activeKey: string, overKey: string) => {
      setColumnOrder((prev) => {
        const oldIndex = prev.indexOf(activeKey);
        const newIndex = prev.indexOf(overKey);
        if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
          return prev;
        }
        return arrayMove(prev, oldIndex, newIndex);
      });
    }, []);

    const resetColumnOrder = useCallback(() => {
      setColumnOrder(columns.map((col) => col.key));
    }, [columns]);

    const orderedColumns = columnOrder
      .map((key) => columns.find((col) => col.key === key))
      .filter((col): col is ColumnDef<TRow> => !!col);

    // Defensive: if the derived list ever drops a column (e.g. columns changed
    // between renders before state catches up), fall back to natural order.
    const safeOrderedColumns =
      orderedColumns.length === columns.length ? orderedColumns : columns;

    return {
      columnOrder,
      orderedColumns: safeOrderedColumns,
      moveColumn,
      resetColumnOrder,
    };
  };
}
