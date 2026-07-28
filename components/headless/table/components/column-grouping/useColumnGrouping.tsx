import { useState, useEffect, useCallback } from "react";
// Type-only: table-component/types.ts also imports this module's types
// (ColumnGroupDef), so this must stay type-only to avoid a real runtime
// circular import between the two modules.
import type { ColumnDef } from "../table-component/types";

// A minimal structural view of the column-order bag (just what's needed to
// mutate the flat order) — kept local rather than imported from
// table-state-v2/types to avoid a circular import (that module imports
// grouping's own types to build the full ColumnGroupingBag).
type ColumnOrderAccess = {
  columnOrder: string[];
  setColumnOrder: (order: string[]) => void;
};

export type ColumnGroupDef = {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
};

export type ColumnGroupingState = {
  groups: ColumnGroupDef[];
  // columnKey -> groupId; a column absent from this map is "root" (ungrouped)
  columnGroupMap: Record<string, string>;
};

const DEFAULT_GROUP_BACKGROUND = "#E3F2FD";
const DEFAULT_GROUP_TEXT_COLOR = "#0D47A1";

function generateGroupId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `grp_${crypto.randomUUID()}`;
  }
  return `grp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function createColumnGroupingHook<TRow>(prefix?: string) {
  return function useColumnGrouping(
    columns: ColumnDef<TRow>[],
    columnOrder: ColumnOrderAccess | undefined,
  ) {
    const storageKey = prefix ? `table-${prefix}-column-grouping` : null;

    const getInitialState = useCallback((): ColumnGroupingState => {
      if (!storageKey) {
        return { groups: [], columnGroupMap: {} };
      }

      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored) as ColumnGroupingState;
          const validColumnKeys = new Set(columns.map((col) => col.key));

          const groups = (parsed.groups ?? []).filter(
            (group): group is ColumnGroupDef =>
              !!group?.id && typeof group.name === "string",
          );
          const validGroupIds = new Set(groups.map((group) => group.id));

          const columnGroupMap: Record<string, string> = {};
          Object.entries(parsed.columnGroupMap ?? {}).forEach(
            ([columnKey, groupId]) => {
              if (
                validColumnKeys.has(columnKey) &&
                validGroupIds.has(groupId)
              ) {
                columnGroupMap[columnKey] = groupId;
              }
            },
          );

          return { groups, columnGroupMap };
        }
      } catch (error) {
        console.error(
          "Failed to load column grouping from localStorage:",
          error,
        );
      }

      return { groups: [], columnGroupMap: {} };
    }, [columns, storageKey]);

    const [state, setState] = useState<ColumnGroupingState>(getInitialState);

    useEffect(() => {
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (error) {
          console.error(
            "Failed to save column grouping to localStorage:",
            error,
          );
        }
      }
    }, [state, storageKey]);

    const groupIdForColumn = useCallback(
      (columnKey: string): string | undefined => state.columnGroupMap[columnKey],
      [state.columnGroupMap],
    );

    const createGroup = useCallback(
      (
        name: string,
        backgroundColor: string = DEFAULT_GROUP_BACKGROUND,
        textColor: string = DEFAULT_GROUP_TEXT_COLOR,
      ): string => {
        const id = generateGroupId();
        setState((prev) => ({
          ...prev,
          groups: [...prev.groups, { id, name, backgroundColor, textColor }],
        }));
        return id;
      },
      [],
    );

    const renameGroup = useCallback((id: string, name: string) => {
      setState((prev) => ({
        ...prev,
        groups: prev.groups.map((group) =>
          group.id === id ? { ...group, name } : group,
        ),
      }));
    }, []);

    const setGroupColors = useCallback(
      (id: string, backgroundColor: string, textColor: string) => {
        setState((prev) => ({
          ...prev,
          groups: prev.groups.map((group) =>
            group.id === id ? { ...group, backgroundColor, textColor } : group,
          ),
        }));
      },
      [],
    );

    const deleteGroup = useCallback((id: string) => {
      setState((prev) => {
        const columnGroupMap = { ...prev.columnGroupMap };
        Object.keys(columnGroupMap).forEach((columnKey) => {
          if (columnGroupMap[columnKey] === id) {
            delete columnGroupMap[columnKey];
          }
        });
        return {
          groups: prev.groups.filter((group) => group.id !== id),
          columnGroupMap,
        };
      });
    }, []);

    // Moves a single column to a target group (or back to root when
    // targetGroupId is null), repositioning it in the flat column order so
    // it always sits adjacent to (not stranded inside) its new/old group's
    // run of members — see column-grouping/columnRuns.ts for how that run
    // is later read back out of the flat order.
    const moveColumnToGroup = useCallback(
      (columnKey: string, targetGroupId: string | null, beforeKey?: string) => {
        const previousGroupId = state.columnGroupMap[columnKey];

        setState((prev) => {
          const columnGroupMap = { ...prev.columnGroupMap };
          if (targetGroupId) {
            columnGroupMap[columnKey] = targetGroupId;
          } else {
            delete columnGroupMap[columnKey];
          }
          return { ...prev, columnGroupMap };
        });

        if (!columnOrder) return;

        const order = columnOrder.columnOrder.filter((key) => key !== columnKey);
        const anchorGroupId = targetGroupId ?? previousGroupId;

        let insertAt = order.length;
        if (beforeKey && order.includes(beforeKey)) {
          insertAt = order.indexOf(beforeKey);
        } else if (anchorGroupId) {
          const memberIndexes = order.reduce<number[]>((acc, key, i) => {
            if (state.columnGroupMap[key] === anchorGroupId) acc.push(i);
            return acc;
          }, []);
          if (memberIndexes.length > 0) {
            insertAt = Math.max(...memberIndexes) + 1;
          }
        }

        const nextOrder = [...order];
        nextOrder.splice(insertAt, 0, columnKey);
        columnOrder.setColumnOrder(nextOrder);
      },
      [columnOrder, state.columnGroupMap],
    );

    // Relocates an entire group's contiguous run of members as one block to
    // sit right before `beforeKey` (or at the end when null). `beforeKey`
    // must resolve to a root column or another group's own anchor key —
    // callers are responsible for not passing a key belonging to the
    // group's own members, or one nested inside a different group.
    const moveGroupBlock = useCallback(
      (groupId: string, beforeKey: string | null) => {
        if (!columnOrder) return;

        const members = columnOrder.columnOrder.filter(
          (key) => state.columnGroupMap[key] === groupId,
        );
        if (members.length === 0) return;

        const memberSet = new Set(members);
        const rest = columnOrder.columnOrder.filter(
          (key) => !memberSet.has(key),
        );

        const insertAt =
          beforeKey && rest.includes(beforeKey)
            ? rest.indexOf(beforeKey)
            : rest.length;

        const nextOrder = [...rest];
        nextOrder.splice(insertAt, 0, ...members);
        columnOrder.setColumnOrder(nextOrder);
      },
      [columnOrder, state.columnGroupMap],
    );

    return {
      groups: state.groups,
      columnGroupMap: state.columnGroupMap,
      groupIdForColumn,
      createGroup,
      renameGroup,
      setGroupColors,
      deleteGroup,
      moveColumnToGroup,
      moveGroupBlock,
    };
  };
}
