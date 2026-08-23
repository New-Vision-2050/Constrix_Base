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
import { darken, lighten } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material/styles";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { ColumnDef, TableProps } from "./types";
import { computeColumnRuns } from "../column-grouping";
import type { ColumnGroupDef } from "../column-grouping";
import { useDragToScroll } from "./useDragToScroll";

// ============================================================================
// Table Component Factory
// ============================================================================

// Prevents tableLayout: "auto" from shrinking columns indefinitely when there
// are many of them — once column minimums exceed the container, the table
// overflows and TableContainer's overflow-x scrolls instead of cramping cells.
const DEFAULT_COLUMN_MIN_WIDTH = 120;

// Resolves an sx-style color token ("action.hover", "background.paper") or a
// literal CSS color ("#F7FDF9") against the theme, for use where MUI's sx
// prop won't auto-resolve theme paths itself (e.g. inside backgroundImage).
function resolveSxColor(theme: Theme, value: string): string {
  if (/^(#|rgb|hsl)/i.test(value)) {
    return value;
  }
  const resolved = value
    .split(".")
    .reduce<unknown>(
      (obj, key) => (obj as Record<string, unknown> | undefined)?.[key],
      theme.palette,
    );
  return typeof resolved === "string" ? resolved : value;
}

// A solid backgroundColor plus a flat linear-gradient "wash" of the tint on
// top of it: two background *layers* on the same element, where the image
// layer always paints over the color layer per the CSS spec — regardless of
// the element's own position/z-index relative to its children. This is what
// makes a semi-transparent tint (e.g. "action.hover") always read as fully
// opaque, without pseudo-elements or extra DOM nodes to get z-index right.
function opaqueTintSx(tintColor: string) {
  return {
    backgroundColor: "background.paper",
    backgroundImage: (theme: Theme) => {
      const color = resolveSxColor(theme, tintColor);
      return `linear-gradient(${color}, ${color})`;
    },
  };
}

// Row hover is driven by JS state (see DataRow's onMouseEnter/onMouseLeave)
// rather than CSS :hover, so every cell — including sticky ones, which sit
// outside the <tr> box and can't be reached by a plain CSS :hover rule —
// reacts the same way from one shared boolean, no marker class needed.
// Plain cells get a brighter wash of their resting color; cells belonging to
// a group get a darker wash of the group's own color instead, so grouped
// cells stay visually distinct from plain ones even while hovered.
function hoverTintSx(baseColor: string, brighten: boolean) {
  return {
    backgroundColor: "background.paper",
    backgroundImage: (theme: Theme) => {
      const resolved = resolveSxColor(theme, baseColor);
      const shifted = brighten ? lighten(resolved, 0.06) : darken(resolved, 0.12);
      return `linear-gradient(${shifted}, ${shifted})`;
    },
  };
}

// Cell content is arbitrary (column.render can nest Chips, icons, or other
// elements with their own explicit colors), so forcing legible text on hover
// means overriding every descendant, not just the cell's own color.
function forcedTextSx(textColor: string) {
  return {
    "& *": {
      color: (theme: Theme) => `${resolveSxColor(theme, textColor)} !important`,
    },
  };
}

type DataRowProps<TRow> = {
  row: TRow;
  index: number;
  columns: ColumnDef<TRow>[];
  selectable: boolean;
  selected: boolean;
  isCrossPageSticky: boolean;
  isGreenTheme: boolean;
  currentTheme: string | undefined;
  getStickyBodySx: (
    index: number,
    backgroundColor: string,
  ) => Record<string, unknown> | undefined;
  getColumnSizingSx: (column: ColumnDef<TRow>) => Record<string, unknown>;
  getColumnGroup: (columnKey: string) => ColumnGroupDef | undefined;
  rowSx?: SxProps<Theme>;
  onToggleSelect: () => void;
};

function DataRow<TRow>({
  row,
  index,
  columns,
  selectable,
  selected,
  isCrossPageSticky,
  isGreenTheme,
  currentTheme,
  getStickyBodySx,
  getColumnSizingSx,
  getColumnGroup,
  rowSx,
  onToggleSelect,
}: DataRowProps<TRow>) {
  const [isHovered, setIsHovered] = useState(false);
  const stripeColor = currentTheme === "green-light" ? "#F7FDF9" : "#14573A";
  const restingBackgroundColor = selected
    ? "action.selected"
    : isCrossPageSticky
      ? "action.hover"
      : isGreenTheme && index % 2 === 1
        ? stripeColor
        : "background.paper";
  // Selected/cross-page-sticky rows already have their own resting tint;
  // only plain rows should swap to the hover tint.
  const showsHoverTint = !selected && !isCrossPageSticky;
  const applyHover = isHovered && showsHoverTint;

  return (
    <TableRow
      selected={selected}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
        ...opaqueTintSx(restingBackgroundColor),
        ...(isCrossPageSticky && {
          borderLeft: "3px solid",
          borderLeftColor: "primary.main",
        }),
        ...rowSx,
      }}
    >
      {selectable &&
        (() => {
          const stickySx = getStickyBodySx(0, restingBackgroundColor);
          return (
            <TableCell
              padding="checkbox"
              sx={{
                ...stickySx,
                ...(applyHover && hoverTintSx(restingBackgroundColor, true)),
              }}
            >
              <Checkbox checked={selected} onChange={onToggleSelect} />
            </TableCell>
          );
        })()}
      {columns.map((column, columnIndex) => {
        // A grouped column always shows its group's colors (group colors
        // come from a native <input type="color"> so they're always fully
        // opaque — no bleed-through risk, unlike the semi-transparent
        // "action.*" row tints, so they can just replace the resting tint
        // directly rather than needing the opaqueTintSx wash treatment).
        const group = getColumnGroup(column.key);
        const tintColor = group?.backgroundColor ?? restingBackgroundColor;
        const stickySx = getStickyBodySx(
          (selectable ? 1 : 0) + columnIndex,
          tintColor,
        );
        return (
          <TableCell
            key={column.key}
            align={column.align || "left"}
            sx={{
              ...getColumnSizingSx(column),
              ...(stickySx ??
                (group ? { backgroundColor: group.backgroundColor } : {})),
              ...(group && { color: group.textColor }),
              ...(applyHover && hoverTintSx(tintColor, !group)),
              ...(applyHover &&
                forcedTextSx(group ? group.textColor : "text.primary")),
            }}
          >
            {column.render(row, index, column)}
          </TableCell>
        );
      })}
    </TableRow>
  );
}

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
    const getRowSx = isUsingState ? props.state.table.getRowSx : undefined;
    const pinnedColumnCount = isUsingState
      ? props.state.table.pinnedColumnCount
      : props.pinnedColumnCount || 0;
    const columnGroups = isUsingState
      ? props.state.columnGrouping?.groups
      : props.columnGroups;
    const columnGroupMap = isUsingState
      ? props.state.columnGrouping?.columnGroupMap
      : props.columnGroupMap;
    const loadingOptions = props.loadingOptions || { rows: 5 };
    const stickyHeader = props.stickyHeader ?? true;
    // MUI's TableContainer sets overflow-x: auto by default, which makes the
    // browser treat it as the nearest scrolling ancestor for position:
    // sticky purposes — but without an explicit height it just grows to fit
    // its content, so there's never any actual scrolling for the header to
    // stick within. A bounded default height gives stickyHeader a real
    // scrollport to work inside instead of silently doing nothing.
    const maxHeight = props.maxHeight ?? (stickyHeader ? "70vh" : undefined);
    const enableDragScroll = props.enableDragScroll ?? true;
    const containerRef = useRef<HTMLDivElement>(null);
    const { onMouseDown: onContainerMouseDown } = useDragToScroll(
      containerRef,
      enableDragScroll
    );

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
      pinnedColumnCount > 0 ? (selectable ? 1 : 0) + pinnedColumnCount : 0;

    // Column grouping: split the final rendered column order into "runs" of
    // consecutive same-group columns (each becomes one spanning header
    // cell) and standalone "root" columns (each keeps its own cell). Pass
    // stickyCount as the forced boundary so a run can never straddle the
    // pinned/scrollable edge — see column-grouping/columnRuns.ts.
    const groupsById = new Map(
      (columnGroups ?? []).map((group) => [group.id, group]),
    );
    const groupIdForColumn = (key: string) => columnGroupMap?.[key];
    const getColumnGroup = (key: string) => {
      const groupId = groupIdForColumn(key);
      return groupId ? groupsById.get(groupId) : undefined;
    };
    const headerRuns = computeColumnRuns(
      columns,
      groupIdForColumn,
      groupsById,
      stickyCount,
    );
    const hasAnyGroups = headerRuns.some((run) => run.type === "group");

    const headerCellRefs = useRef<Array<HTMLTableCellElement | null>>([]);
    const [stickyOffsets, setStickyOffsets] = useState<number[]>([]);

    const measureStickyOffsets = useCallback(() => {
      const offsets: number[] = [];
      let cumulative = 0;
      for (let i = 0; i < stickyCount; i++) {
        offsets.push(cumulative);
        cumulative +=
          headerCellRefs.current[i]?.getBoundingClientRect().width ?? 0;
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

    // When both stickyHeader and column grouping are active, the group row
    // and the column row must stick one below the other (not both at
    // top: 0), so the column row's sticky offset needs the group row's
    // rendered height — measured the same ref+ResizeObserver way as the
    // pinned-column offsets above, since header row height is also
    // content-driven and can change (font loading, wrapping, zoom).
    const groupHeaderRowRef = useRef<HTMLTableRowElement | null>(null);
    const [groupRowHeight, setGroupRowHeight] = useState(0);

    useLayoutEffect(() => {
      if (!stickyHeader || !hasAnyGroups) {
        setGroupRowHeight(0);
        return undefined;
      }
      const measure = () =>
        setGroupRowHeight(
          groupHeaderRowRef.current?.getBoundingClientRect().height ?? 0,
        );
      measure();
      const observer = new ResizeObserver(measure);
      if (groupHeaderRowRef.current) observer.observe(groupHeaderRowRef.current);
      return () => observer.disconnect();
    }, [stickyHeader, hasAnyGroups, columns, data, loading]);

    // minWidth stops the column from shrinking away; overflowWrap lets long
    // unbroken content (emails, IDs, URLs) break and wrap within that width
    // instead of spilling out of the cell.
    const getColumnSizingSx = (column: ColumnDef<TRow>) => ({
      minWidth: column.minWidth ?? DEFAULT_COLUMN_MIN_WIDTH,
      overflowWrap: "anywhere" as const,
    });

    // Pinned cells stay single-line with ellipsis instead of wrapping: a
    // sticky column that grows to several lines makes that one row much
    // taller than its neighbours, and the extra height reads as its content
    // overlapping the rows above/below once the table has to scroll — fixed
    // columns in most table libraries stay single-line for the same reason.
    const stickyTextSx = {
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    // A cell can be sticky on either axis independently: left-sticky (pinned
    // column, existing behavior) and/or top-sticky (stickyHeader, new).
    // Left-sticky cells keep zIndex 3 regardless, so a "corner" cell (both
    // pinned and in a sticky header) still layers above plain sticky-header
    // cells (zIndex 2) and sticky-body-column cells (zIndex 1) as the table
    // scrolls on both axes at once.
    const getStickyHeaderSx = (index: number, topOffset = 0) => {
      const isLeftSticky = index < stickyCount;
      if (!isLeftSticky && !stickyHeader) return undefined;
      return {
        position: "sticky" as const,
        ...(isLeftSticky && { left: stickyOffsets[index] ?? 0 }),
        ...(stickyHeader && { top: topOffset }),
        zIndex: isLeftSticky ? 3 : 2,
        backgroundColor: isGreenTheme ? "primary.main" : "background.default",
        ...(isLeftSticky && stickyTextSx),
        ...(isLeftSticky &&
          index === stickyCount - 1 && {
            borderRight: "1px solid",
            borderRightColor: "divider",
          }),
      };
    };

    // Row tint tokens like "action.hover"/"action.selected" are semi-
    // transparent by design (meant to overlay a solid surface) — setting one
    // directly as a sticky cell's own backgroundColor let the scrolled-under
    // column's content show through it. opaqueTintSx layers it as a flat
    // backgroundImage wash over an opaque backgroundColor instead, so the
    // result reads correctly tinted but is always fully opaque underneath.
    const getStickyBodySx = (index: number, tintColor: string) =>
      index < stickyCount
        ? {
            position: "sticky" as const,
            left: stickyOffsets[index] ?? 0,
            zIndex: 1,
            ...opaqueTintSx(tintColor),
            ...stickyTextSx,
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

    // Renders one column's normal header cell (name + sort label). Shared
    // between the grouped-header row (root columns, rowSpan=2) and the
    // regular header row (ungrouped tables, and grouped columns), so the
    // sort-label markup and sticky-ref wiring only exist in one place.
    const renderColumnHeaderCell = (
      column: ColumnDef<TRow>,
      stickyIndex: number,
      rowSpan?: number,
      topOffset = 0,
    ) => (
      <TableCell
        key={column.key}
        align={column.align || "left"}
        rowSpan={rowSpan}
        ref={(el: HTMLTableCellElement | null) => {
          if (stickyIndex < stickyCount) {
            headerCellRefs.current[stickyIndex] = el;
          }
        }}
        sx={{
          ...getColumnSizingSx(column),
          ...getStickyHeaderSx(stickyIndex, topOffset),
        }}
      >
        {column.sortable ? (
          <TableSortLabel
            active={sortBy === column.key}
            direction={sortBy === column.key ? sort || "asc" : "asc"}
            onClick={() => handleColumnSort(column.key, column.sortable)}
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

    const renderCheckboxHeaderCell = (rowSpan?: number) => (
      <TableCell
        padding="checkbox"
        rowSpan={rowSpan}
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
    );

    // Render Loading State in Table Body
    const renderLoadingState = () => {
      const skeletonRows = loadingOptions.rows || 5;
      return (
        <>
          {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{ backgroundColor: "background.paper" }}
            >
              {selectable && (
                <TableCell
                  padding="checkbox"
                  sx={getStickyBodySx(0, "background.paper")}
                >
                  <Skeleton variant="rectangular" width={42} height={42} />
                </TableCell>
              )}
              {columns.map((column, columnIndex) => (
                <TableCell
                  key={column.key}
                  sx={{
                    ...getColumnSizingSx(column),
                    ...getStickyBodySx(
                      (selectable ? 1 : 0) + columnIndex,
                      "background.paper",
                    ),
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
        <TableContainer
          ref={containerRef}
          onMouseDown={onContainerMouseDown}
          sx={maxHeight ? { maxHeight, overflow: "auto" } : undefined}
        >
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
              {hasAnyGroups && (
                <TableRow
                  ref={groupHeaderRowRef}
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
                  {selectable && renderCheckboxHeaderCell(2)}
                  {headerRuns.map((run) => {
                    const stickyIndex = (selectable ? 1 : 0) + run.startIndex;
                    if (run.type === "root") {
                      return renderColumnHeaderCell(run.column, stickyIndex, 2);
                    }
                    return (
                      <TableCell
                        key={`group-${run.groupId}-${run.startIndex}`}
                        colSpan={run.columns.length}
                        sx={{
                          ...getStickyHeaderSx(stickyIndex),
                          ...opaqueTintSx(run.group.backgroundColor),
                          color: run.group.textColor,
                          fontWeight: 600,
                        }}
                      >
                        {run.group.name}
                      </TableCell>
                    );
                  })}
                </TableRow>
              )}
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
                {!hasAnyGroups && selectable && renderCheckboxHeaderCell()}
                {hasAnyGroups
                  ? headerRuns.flatMap((run) =>
                      run.type === "group"
                        ? run.columns.map((column, offset) =>
                            renderColumnHeaderCell(
                              column,
                              (selectable ? 1 : 0) + run.startIndex + offset,
                              undefined,
                              groupRowHeight,
                            ),
                          )
                        : [],
                    )
                  : columns.map((column, columnIndex) =>
                      renderColumnHeaderCell(
                        column,
                        (selectable ? 1 : 0) + columnIndex,
                      ),
                    )}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? renderLoadingState()
                : data.length === 0
                  ? renderEmptyState()
                  : data.map((row, index) => (
                      <DataRow
                        key={getRowKey(row, index)}
                        row={row}
                        index={index}
                        columns={columns}
                        selectable={!!selectable}
                        selected={isRowSelected(row, index)}
                        isCrossPageSticky={
                          stateSelection?.isRowFromOtherPage(row) || false
                        }
                        isGreenTheme={isGreenTheme}
                        currentTheme={currentTheme}
                        getStickyBodySx={getStickyBodySx}
                        getColumnSizingSx={getColumnSizingSx}
                        getColumnGroup={getColumnGroup}
                        rowSx={getRowSx ? getRowSx(row, index) : undefined}
                        onToggleSelect={() => handleRowSelect(row, index)}
                      />
                    ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  };

  return TableComponent;
}
