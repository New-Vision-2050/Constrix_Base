import type { ColumnGroupDef } from "./useColumnGrouping";

export type ColumnRun<TCol> =
  | { type: "root"; column: TCol; startIndex: number }
  | {
      type: "group";
      groupId: string;
      group: ColumnGroupDef;
      columns: TCol[];
      startIndex: number;
    };

/**
 * Splits an ordered column list into "runs": each contiguous stretch of
 * columns sharing the same group becomes one "group" run (rendered as a
 * single spanning header cell); every ungrouped column is its own "root"
 * run (rendered with its own header cell, never merged with neighbours).
 *
 * `boundaryIndex` (when given) forces a run to end at that index even if
 * the same group continues past it — used to keep a run from straddling
 * the pinned/scrollable boundary on the live table, since a run spanning
 * both would have no single coherent sticky answer. Pass it as
 * `stickyCount` so "a run is sticky iff it's entirely before the
 * boundary" always holds, with no ambiguous case to special-case.
 */
export function computeColumnRuns<TCol extends { key: string }>(
  columns: TCol[],
  groupIdForColumn: (key: string) => string | undefined,
  groupsById: Map<string, ColumnGroupDef>,
  boundaryIndex?: number,
): ColumnRun<TCol>[] {
  const isBeforeBoundary = (index: number) =>
    boundaryIndex !== undefined && index < boundaryIndex;

  const runs: ColumnRun<TCol>[] = [];
  let i = 0;
  while (i < columns.length) {
    const rawGroupId = groupIdForColumn(columns[i].key);
    const groupId =
      rawGroupId && groupsById.has(rawGroupId) ? rawGroupId : undefined;

    if (!groupId) {
      runs.push({ type: "root", column: columns[i], startIndex: i });
      i += 1;
      continue;
    }

    const startIndex = i;
    const side = isBeforeBoundary(startIndex);
    const groupColumns: TCol[] = [];
    while (
      i < columns.length &&
      groupIdForColumn(columns[i].key) === groupId &&
      isBeforeBoundary(i) === side
    ) {
      groupColumns.push(columns[i]);
      i += 1;
    }

    runs.push({
      type: "group",
      groupId,
      group: groupsById.get(groupId)!,
      columns: groupColumns,
      startIndex,
    });
  }

  return runs;
}
