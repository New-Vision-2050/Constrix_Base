import { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "../table-component/types";

export type ColumnPinningState = string[];

export const MAX_PINNED_COLUMNS = 3;

export function createColumnPinningHook<TRow>(prefix?: string) {
  return function useColumnPinning(columns: ColumnDef<TRow>[]) {
    const storageKey = prefix ? `table-${prefix}-column-pinning` : null;

    const getInitialPinning = useCallback((): ColumnPinningState => {
      if (!storageKey) {
        return [];
      }

      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as ColumnPinningState;
          const validKeys = new Set(columns.map((col) => col.key));
          return parsed
            .filter((key) => validKeys.has(key))
            .slice(0, MAX_PINNED_COLUMNS);
        }
      } catch (error) {
        console.error(
          "Failed to load column pinning from localStorage:",
          error,
        );
      }

      return [];
    }, [columns, storageKey]);

    const [pinnedKeys, setPinnedKeys] =
      useState<ColumnPinningState>(getInitialPinning);

    // Save to localStorage whenever pinning changes
    useEffect(() => {
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(pinnedKeys));
        } catch (error) {
          console.error(
            "Failed to save column pinning to localStorage:",
            error,
          );
        }
      }
    }, [pinnedKeys, storageKey]);

    const isPinned = useCallback(
      (columnKey: string) => pinnedKeys.includes(columnKey),
      [pinnedKeys],
    );

    // Toggle pin state for a column, respecting the max pinned limit
    const togglePin = useCallback((columnKey: string) => {
      setPinnedKeys((prev) => {
        if (prev.includes(columnKey)) {
          return prev.filter((key) => key !== columnKey);
        }
        if (prev.length >= MAX_PINNED_COLUMNS) {
          return prev;
        }
        return [...prev, columnKey];
      });
    }, []);

    const clearPinnedColumns = useCallback(() => {
      setPinnedKeys([]);
    }, []);

    const pinnedColumns = pinnedKeys
      .map((key) => columns.find((col) => col.key === key))
      .filter((col): col is ColumnDef<TRow> => !!col);

    return {
      pinnedKeys,
      isPinned,
      togglePin,
      clearPinnedColumns,
      pinnedColumns,
      canPinMore: pinnedKeys.length < MAX_PINNED_COLUMNS,
      maxPinned: MAX_PINNED_COLUMNS,
    };
  };
}
